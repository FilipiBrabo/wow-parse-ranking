import { gql } from '@apollo/client';
import { Injectable } from '@nestjs/common';

import { parseEncounterName } from '../../utils';
import { ApolloService } from '../apollo.service';
import { PrismaService } from '../prisma.service';
import { CharacterRankingsResponse, GuildReportsResponse } from './types';

@Injectable()
export class WclService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly apolloService: ApolloService
  ) {}

  async updateCharactersDatabase() {
    const guild = await this.prismaService.guild.findFirst();

    const reports = await this.apolloService.query<GuildReportsResponse>({
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
          guildId: guild.id,
        }))
    );

    await this.prismaService.character.createMany({
      data: characters,
      skipDuplicates: true,
    });

    return characters;
  }

  async getCharactersParses() {
    // This should be done by a async service...
    // Do we need to batch?

    const characters = await this.prismaService.character.findMany({
      include: { guild: true },
    });

    const activeEncounters = await this.prismaService.encounter.findMany({
      where: { isActive: true },
    });

    const query = `
    query GetCharacterRankings(
      $characterName: String!
      $serverSlug: String!
      $serverRegion: String!
    ) {
      characterData {
        character(
          name: $characterName
          serverSlug: $serverSlug
          serverRegion: $serverRegion
        ) {
          name
          ${activeEncounters
            .map(
              (encounter) =>
                `${parseEncounterName(
                  encounter.name
                )}: encounterRankings(encounterID: ${
                  encounter.wclId
                }, role: DPS, difficulty: ${encounter.difficulty}, size: 25)`
            )
            .concat('\n')}
        }
      }
    }
  `;

    const createdRankings = [];
    const errors = [];

    console.time();

    await Promise.all(
      characters.map(async (character) => {
        try {
          const characterDataResponse =
            await this.apolloService.query<CharacterRankingsResponse>({
              query: gql(query),
              variables: {
                characterName: character.name,
                serverSlug: character.guild.serverSlug,
                serverRegion: character.guild.serverRegion,
              },
            });

          const characterRanks = activeEncounters.flatMap((encounter) => {
            return characterDataResponse.data.characterData.character[
              parseEncounterName(encounter.name)
            ].ranks.map((rank) => ({
              encounterId: encounter.id,
              reportCode: rank.report.code,
              spec: rank.spec,
              characterId: character.id,
              lockedIn: rank.lockedIn,
              todayPercent: rank.todayPercent,
              duration: rank.duration,
              amount: rank.amount,
            }));
          });

          createdRankings.push(characterRanks);

          await this.prismaService.ranking.createMany({
            data: characterRanks,
            skipDuplicates: true,
          });
        } catch (error) {
          errors.push({ error, character });
          console.log({ error, character });
        }
      })
    );

    console.timeEnd();

    return { toUpdate: characters.length, updated: createdRankings.length };
  }
}
