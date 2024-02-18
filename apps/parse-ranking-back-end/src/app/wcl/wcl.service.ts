import { Injectable } from '@nestjs/common';
import { Character, Encounter, Guild } from '@prisma/client';
import { uniqBy } from 'lodash';

import { ApolloService } from '../apollo.service';
import { PrismaService } from '../prisma.service';
import { getCharacterRankingsQuery, getGuildReportsQuery } from './gql-queries';
import { WclCharacterRankingsResponse, WclGuildReportsResponse } from './types';
import { getBestRanks, getMostRecentReportDate } from './utils';

const ONE_WEEK_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class WclService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly apolloService: ApolloService
  ) {}

  async updateCharactersDatabase() {
    const guild = await this.prismaService.guild.findFirst({
      orderBy: { lastCharacterUpdate: { sort: 'asc', nulls: 'first' } },
      where: {
        isBrazilian: true,
      },
    });

    if (!guild) return;

    const guildReports = await this.getGuildReports(guild);

    // Filter reports that are at max two weeks old
    const recentReports = guildReports.filter(
      (report) =>
        report.startTime > new Date().getTime() - 2 * ONE_WEEK_MILLISECONDS
    );

    const characters = recentReports.flatMap((report) =>
      report.players.map((player) => ({
        name: player.name,
        class: player.type,
        serverRegion: guild.serverRegion,
        serverSlug: guild.serverSlug,
        guildId: guild.id,
      }))
    );

    const uniqueCharacters = uniqBy(characters, (character) => character.name);

    for (const character of uniqueCharacters) {
      await this.prismaService.character.upsert({
        create: character,
        update: { isActive: true },
        where: { name: character.name },
      });
    }

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
      where: { isActive: true, isBrazilian: true },
      take: 15,
    });

    const activeEncounters = await this.prismaService.encounter.findMany({
      where: { isActive: true },
    });

    await Promise.all(
      characters.map(async (character) => {
        const characterEncounterRankings = await this.getCharacterRankings(
          character,
          activeEncounters
        );

        if (!characterEncounterRankings) return;

        const mostRecentReportDate = getMostRecentReportDate(
          characterEncounterRankings
        );

        const lastMonth = new Date(
          new Date().getTime() - 4 * ONE_WEEK_MILLISECONDS
        );
        // Deactivate character if he didn't raid in the last month
        if (mostRecentReportDate && mostRecentReportDate < lastMonth) {
          await this.prismaService.character.update({
            data: {
              isActive: false,
            },
            where: {
              id: character.id,
            },
          });

          return;
        }

        const bestCharacterRanks = getBestRanks(
          characterEncounterRankings,
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
            wclId: characterEncounterRankings.id,
            lastRankUpdate: new Date(),
          },
          where: { id: character.id },
        });
      })
    );

    return characters;
  }

  private async getGuildReports(guild: Guild) {
    const { query, variables } = getGuildReportsQuery(guild);

    // TODO: handle error
    const {
      data: {
        guildData: {
          guild: {
            attendance: { data: reports },
          },
        },
      },
    } = await this.apolloService.query<WclGuildReportsResponse>({
      query,
      variables,
    });

    return reports;
  }

  private async getCharacterRankings(
    character: Character & { guild: Guild | null },
    encounters: Encounter[]
  ) {
    const { query, variables } = getCharacterRankingsQuery(
      character,
      encounters
    );

    // TODO: handle error
    const {
      data: {
        characterData: { character: characterWithRanks },
      },
    } = await this.apolloService.query<WclCharacterRankingsResponse>({
      query,
      variables,
    });

    return characterWithRanks;
  }
}
