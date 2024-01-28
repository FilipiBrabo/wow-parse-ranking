import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';
import { RankingsOptions } from './rankings.controller';
import { CharacterWithRank } from './types';

@Injectable()
export class RankingService {
  constructor(private prismaService: PrismaService) {}

  async getRanks(
    encounterIds: number[],
    options?: RankingsOptions
  ): Promise<{ total: number; items: CharacterWithRank[] }> {
    const filterConditions: Prisma.Sql[] = [];

    if (options?.class) {
      filterConditions.push(Prisma.sql`class ILIKE ${options.class}`);
    }

    if (options?.spec) {
      filterConditions.push(Prisma.sql`spec ILIKE ${options.spec}`);
    }

    if (options?.guildId) {
      filterConditions.push(Prisma.sql`"guildId" = ${options.guildId}`);
    }

    const sqlFilter = filterConditions.length
      ? Prisma.sql`AND ${Prisma.join(filterConditions, ' AND ')}`
      : Prisma.empty;

    // TODO: is there a way to make this query type safe?
    const averageBestRanksWithCount: (CharacterWithRank & { count: number })[] =
      await this.prismaService.$queryRaw`
      SELECT
        (COUNT(*) over())::int,
        "maxRanks".name,
        "Guild".name as "guildName",
        "Guild"."wclId" as "guildId",
        "Guild"."serverSlug" as "realm",
        "Guild"."serverRegion" as "region",
        "characterId" as "id",
        "class",
        "spec",
        ROUND(SUM("maxTodayPercent"::numeric)/${
          encounterIds.length
        }, 2) AS "rank"
      FROM (
        SELECT
          "name",
          "guildId",
          "class",
          "characterId",
          "encounterId",
          "spec",
          MAX("todayPercent") AS "maxTodayPercent"
        FROM "Ranking" as R INNER JOIN "Character" as C ON C.id = R."characterId"
        WHERE
          "todayPercent" IS NOT NULL
          AND "encounterId" = ANY(${encounterIds})
          ${sqlFilter}
        GROUP BY "characterId", "encounterId", "name", "spec", "guildId", "class"
        ) as "maxRanks"
      LEFT JOIN "Guild" ON "Guild".id = "guildId"
      GROUP BY "maxRanks"."characterId", "maxRanks".name, "spec", "guildId", "Guild".name, "Guild"."serverSlug", "class", "Guild"."wclId",  "Guild"."serverRegion"
      ORDER BY "rank" DESC
      LIMIT ${options?.limit ?? 15}
      OFFSET ${options?.offset ?? 0}
    `;

    const count = averageBestRanksWithCount[0]?.count ?? 0;

    const averageBestRanks = averageBestRanksWithCount.map((rankWithCount) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
      const { count, ...bestRank } = rankWithCount;

      return bestRank;
    });

    return { total: count, items: averageBestRanks };
  }
}
