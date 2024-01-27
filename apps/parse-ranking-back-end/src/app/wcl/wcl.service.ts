import { gql } from '@apollo/client';
import { Injectable } from '@nestjs/common';
import { groupBy, maxBy, pickBy } from 'lodash';

import { parseEncounterName } from '../../utils';
import { ApolloService } from '../apollo.service';
import { PrismaService } from '../prisma.service';
import { CLASS_BY_WCL_CLASS_ID, INVALID_SPECS_BY_CLASS } from './constants';
import { CharacterRankingsResponse, GuildReportsResponse, Rank } from './types';

@Injectable()
export class WclService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly apolloService: ApolloService
  ) {}

  async updateCharactersDatabase() {
    const guild = await this.prismaService.guild.findFirst();

    if (!guild) return;

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

    await this.prismaService.character.createMany({
      data: characters,
      skipDuplicates: true,
    });

    return characters;
  }

  async getCharactersParses() {
    const characters = await this.prismaService.character.findMany({
      include: { guild: true },
      orderBy: { lastRankUpdate: { sort: 'asc', nulls: 'first' } },
      where: { isActive: true },
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
          id
          name
          classID
          ${activeEncounters
            .map(
              (encounter) =>
                `${parseEncounterName(
                  encounter.name
                )}: encounterRankings(encounterID: ${
                  encounter.wclId
                }, role: DPS, difficulty: ${encounter.difficulty}, size: ${
                  encounter.size
                })`
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
                serverSlug: character.serverSlug ?? character.guild?.serverSlug,
                serverRegion:
                  character.serverRegion ?? character.guild?.serverRegion,
              },
            });

          const characterData =
            characterDataResponse.data.characterData.character;

          const characterClass =
            // TODO: fix this types
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (CLASS_BY_WCL_CLASS_ID as any)[(characterData as any).classID];

          const characterRanks = activeEncounters.flatMap((encounter) => {
            const encounterRanks =
              characterData[parseEncounterName(encounter.name)]?.ranks;

            // Group by spec and get for each spec the best rank
            // Also filters invalid specs
            const bestEncounterRanks = Object.values(
              pickBy(
                groupBy(encounterRanks, (rank) => rank.spec),
                (_, spec) => {
                  const invalidSpecs =
                    // TODO: fix type assertion
                    INVALID_SPECS_BY_CLASS[characterClass as string];

                  return !invalidSpecs?.includes(spec);
                }
              )
            ).map((ranks) => maxBy(ranks, (rank) => rank.todayPercent));

            const isRank = (rank: Rank | undefined): rank is Rank => !!rank;

            return bestEncounterRanks.filter(isRank).map((rank) => ({
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

          for (const rank of characterRanks) {
            await this.prismaService.ranking.upsert({
              where: {
                characterId_encounterId_spec: {
                  characterId: rank.characterId,
                  encounterId: rank.encounterId,
                  spec: rank.spec,
                },
              },
              update: rank,
              create: rank,
            });
          }

          await this.prismaService.character.update({
            data: {
              wclId: (characterData as any).id,
              lastRankUpdate: new Date(),
            },
            where: { id: character.id },
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
