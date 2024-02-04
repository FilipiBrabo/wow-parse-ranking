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
    // TODO: surely I can find a better way to structure this
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

    const rankedCharactersWithTotalCount: (CharacterWithRank & {
      totalCount: number;
    })[] = await this.prismaService.$queryRaw`WITH "RankedSpecs" AS (
        SELECT
          r."characterId",
          r."spec",
          SUM(CAST(r."todayPercent" AS NUMERIC)) / ${encounterIds.length} AS "avgTodayPercent",
          CAST(ROW_NUMBER() OVER (PARTITION BY r."characterId" ORDER BY SUM(CAST(r."todayPercent" AS NUMERIC)) / ${encounterIds.length} DESC) AS INT) AS "specRank"
        FROM
          "Ranking" r
        JOIN
          "Encounter" e ON r."encounterId" = e."id"
        JOIN
          "Character" c ON r."characterId" = c."id"
        WHERE
          r."todayPercent" IS NOT NULL
          AND c."isActive" = TRUE
          AND e."id" = ANY(${encounterIds})
          ${sqlFilter}
        GROUP BY
          r."characterId", r."spec"
      )
      SELECT
        c."id" AS "id",
        c."name" AS "name",
        g."name" AS "guildName",
        g."wclId" AS "guildId",
        c."serverRegion" AS "region",
        c."serverSlug" AS "realm",
        c."lastRankUpdate" AS "lastRankUpdate",
        c."class",
        rs."spec",
        rs."avgTodayPercent" as "todayPercent",
        CAST(DENSE_RANK() OVER (ORDER BY MAX(rs."avgTodayPercent") DESC) AS INT) AS "rank",
        CAST(COUNT(*) OVER () AS NUMERIC) AS "totalCount"
      FROM
        "RankedSpecs" rs
      JOIN
        "Character" c ON rs."characterId" = c."id"
      LEFT JOIN
        "Guild" g ON c."guildId" = g."id"
      WHERE
        rs."specRank" = 1
      GROUP BY
        c."id", g."id", rs."spec", rs."avgTodayPercent"
      ORDER BY
        rs."avgTodayPercent" DESC
      LIMIT ${options?.limit} OFFSET ${options?.offset};`;

    const totalCount = rankedCharactersWithTotalCount[0]?.totalCount ?? 0;

    const rankedCharacters = rankedCharactersWithTotalCount.map(
      (rankWithCount) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
        const { totalCount, ...bestRank } = rankWithCount;
        return bestRank;
      }
    );

    return {
      total: totalCount,
      items: rankedCharacters,
    };
  }
}
