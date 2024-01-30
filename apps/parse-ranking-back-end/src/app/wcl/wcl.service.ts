import { gql } from '@apollo/client';
import { Injectable } from '@nestjs/common';
import { uniqBy } from 'lodash';

import { ApolloService } from '../apollo.service';
import { PrismaService } from '../prisma.service';
import { WclGuildReportsResponse } from './types';
import { getBestRanks } from './utils';

@Injectable()
export class WclService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly apolloService: ApolloService
  ) {}

  async updateCharactersDatabase() {
    const now = new Date();
    const oneWeekMilliSeconds = 7 * 24 * 60 * 60 * 1000;
    const lastWeek = new Date(now.getTime() - oneWeekMilliSeconds);

    const guild = await this.prismaService.guild.findFirst({
      orderBy: { lastCharacterUpdate: { sort: 'asc', nulls: 'first' } },
      where: {
        OR: [
          {
            lastCharacterUpdate: {
              lte: lastWeek,
            },
          },
          { lastCharacterUpdate: null },
        ],
      },
    });

    if (!guild) return;

    const reports = await this.apolloService.query<WclGuildReportsResponse>({
      query: gql`
        query GuildReports($guildId: Int!) {
          guildData {
            guild(id: $guildId) {
              name
              attendance(limit: 25) {
                data {
                  startTime
                  code
                  players {
                    name
                    type
                  }
                }
              }
            }
          }
        }
      `,
      variables: { guildId: guild.wclId },
    });

    const characters = reports.data.guildData.guild.attendance.data.flatMap(
      (report) =>
        report.players.map((player) => ({
          name: player.name,
          class: player.type,
          guildId: guild.id,
        }))
    );

    const uniqueCharacters = uniqBy(characters, (character) => character.name);

    await this.prismaService.character.createMany({
      data: uniqueCharacters,
      skipDuplicates: true,
    });

    await this.prismaService.guild.update({
      data: { lastCharacterUpdate: new Date() },
      where: { id: guild.id },
    });

    return characters;
  }

  async updateCharacterRanks() {
    const characters = await this.prismaService.character.findMany({
      include: { guild: true },
      orderBy: { lastRankUpdate: { sort: 'asc', nulls: 'first' } },
      where: { isActive: true },
      take: 15,
    });

    // TODO:
    // mark inactive characters that didn't raid in the last 30 days

    const activeEncounters = await this.prismaService.encounter.findMany({
      where: { isActive: true },
    });

    console.time();

    await Promise.all(
      characters.map(async (character) => {
        const characterWithRanks =
          await this.apolloService.getCharacterRankings(
            character,
            activeEncounters
          );

        if (!characterWithRanks) return;

        const bestCharacterRanks = getBestRanks(
          characterWithRanks,
          activeEncounters
        );

        for (const rank of bestCharacterRanks) {
          await this.prismaService.ranking.upsert({
            where: {
              characterId_encounterId_spec: {
                characterId: character.id,
                encounterId: rank.encounterId,
                spec: rank.spec,
              },
            },
            update: { ...rank, characterId: character.id },
            create: { ...rank, characterId: character.id },
          });
        }

        await this.prismaService.character.update({
          data: {
            wclId: characterWithRanks.id,
            lastRankUpdate: new Date(),
          },
          where: { id: character.id },
        });
      })
    );

    console.timeEnd();
  }
}
