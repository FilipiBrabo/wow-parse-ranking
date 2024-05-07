import { Prisma } from '@prisma/client';
import { z } from 'zod';

import prisma from '../../database/prisma';
import { publicProcedure, router } from '../trpc';

type CharacterWithRank = {
  rank: number;
  id: number;
  name: string;
  guildName: string;
  guildId: number;
  realm: string;
  region: string;
  class: string;
  spec: string;
  todayPercent: Prisma.Decimal;
  lastRankUpdate: string;
};

export const rankRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().default(15),
        offset: z.number().default(0),
        class: z.string().optional(),
        spec: z.string().optional(),
        guildId: z.number().optional(),
        partition: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      const encounters = await prisma.encounter.findMany({
        select: {
          id: true,
        },
        where: {
          Raid: { name: 'Icecrown Citadel' },
        },
      });

      const encounterIds = encounters.map((encounter) => encounter.id);

      const filterConditions: Prisma.Sql[] = [];
      // TODO: surely I can find a better way to structure this
      if (input?.class) {
        filterConditions.push(Prisma.sql`class ILIKE ${input.class}`);
      }

      if (input?.guildId) {
        filterConditions.push(Prisma.sql`"guildId" = ${input.guildId}`);
      }

      if (input?.partition) {
        filterConditions.push(Prisma.sql`r.partition = ${input.partition}`);
      } else {
        filterConditions.push(Prisma.sql`r.partition = raid.partition`);
      }

      const sqlFilter = filterConditions.length
        ? Prisma.sql`AND ${Prisma.join(filterConditions, ' AND ')}`
        : Prisma.empty;

      const specFilter = input?.spec
        ? Prisma.sql`AND rs.spec ILIKE ${input.spec}`
        : Prisma.empty;

      const rankedCharactersWithTotalCount: (CharacterWithRank & {
        totalCount: Prisma.Decimal;
      })[] = await prisma.$queryRaw`WITH "RankedSpecs" AS (
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
        LEFT JOIN
          "Raid" raid ON r."partition" = raid."partition"
        WHERE
          r."todayPercent" IS NOT NULL
          AND c."isActive" = TRUE
          AND c."isBrazilian" = TRUE
          AND e."id" = ANY(${encounterIds})
          ${sqlFilter}
        GROUP BY
          r."characterId", r."spec", r."partition"
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
        ROUND(rs."avgTodayPercent", 2)  as "todayPercent",
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
        ${specFilter}
      GROUP BY
        c."id", g."id", rs."spec", rs."avgTodayPercent"
      ORDER BY
        rs."avgTodayPercent" DESC
      LIMIT ${input.limit} OFFSET ${input.offset};`;

      const totalCount =
        Number(rankedCharactersWithTotalCount[0]?.totalCount) ?? 0;

      const rankedCharacters = rankedCharactersWithTotalCount.map(
        (rankWithCount) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
          const { totalCount, todayPercent, ...bestRank } = rankWithCount;

          return {
            ...bestRank,
            // Convert from Prisma.Decimal to string
            todayPercent: String(todayPercent),
          };
        }
      );

      return {
        items: rankedCharacters,
        total: totalCount,
        limit: input.limit,
        offset: input.offset,
      };
    }),
});
