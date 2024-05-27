import { and, desc, eq, ilike, inArray, isNotNull, sql } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '../../database/drizzle/db';
import {
  character,
  encounter,
  guild,
  partition,
  raid,
  ranking,
} from '../../database/drizzle/schema';
import { publicProcedure, router } from '../trpc';

export const rankRouter = router({
  getRanks: publicProcedure
    .input(
      z.object({
        raidSlug: z.string(),
        limit: z.number().default(15),
        offset: z.number().default(0),
        class: z.string().optional(),
        spec: z.string().optional(),
        guildId: z.number().optional(),
        partition: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      const encounters = await db
        .select({ id: encounter.id })
        .from(encounter)
        .leftJoin(raid, eq(raid.id, encounter.raidId))
        .where(eq(raid.slug, input.raidSlug));

      const encounterIds = encounters.map((encounter) => encounter.id);

      const rankedSpecs = db.$with('ranked_specs').as(
        db
          .select({
            characterId: ranking.characterId,
            characterName: character.name,
            characterServerRegion: character.serverRegion,
            characterServerSlug: character.serverSlug,
            characterLastRankUpdate: character.lastRankUpdate,
            characterGuildId: character.guildId,
            characterClass: character.class,
            partition: ranking.partition,
            spec: ranking.spec,
            avgTodayPercent:
              sql`SUM(CAST(${ranking.todayPercent} AS NUMERIC)) / ${encounterIds.length}`.as(
                'avgTodayPercent'
              ),
            specRank:
              sql`CAST(ROW_NUMBER() OVER (PARTITION BY ${ranking.characterId} ORDER BY SUM(CAST(${ranking.todayPercent} AS NUMERIC)) / ${encounterIds.length} DESC) AS INT)`.as(
                'specRank'
              ),
          })
          .from(ranking)
          .innerJoin(encounter, eq(ranking.encounterId, encounter.id))
          .innerJoin(character, eq(ranking.characterId, character.id))
          .innerJoin(partition, eq(ranking.partition, partition.wclId))
          .groupBy(
            ({
              spec,
              characterId,
              characterName,
              characterServerRegion,
              characterServerSlug,
              characterLastRankUpdate,
              characterGuildId,
              characterClass,
              partition,
            }) => [
              spec,
              characterId,
              characterName,
              characterServerRegion,
              characterServerSlug,
              characterLastRankUpdate,
              characterGuildId,
              characterClass,
              partition,
            ]
          )
          .where(
            and(
              isNotNull(ranking.todayPercent),
              eq(character.isBrazilian, true),
              inArray(encounter.id, encounterIds),
              input.class ? ilike(character.class, input.class) : undefined,
              input.guildId ? eq(guild.id, input.guildId) : undefined,
              input.partition ? eq(partition.wclId, input.partition) : undefined
            )
          )
      );

      const rankedCharactersWithTotalCount = await db
        .with(rankedSpecs)
        .select({
          id: rankedSpecs.characterId,
          name: rankedSpecs.characterName,
          guildName: guild.name,
          guildId: guild.wclId,
          region: rankedSpecs.characterServerRegion,
          realm: rankedSpecs.characterServerSlug,
          lastRankUpdate: rankedSpecs.characterLastRankUpdate,
          class: rankedSpecs.characterClass,
          spec: rankedSpecs.spec,
          todayPercent: sql<string>`ROUND(${rankedSpecs.avgTodayPercent}, 2)`,
          rank: sql<number>`CAST(DENSE_RANK() OVER (ORDER BY MAX(${rankedSpecs.avgTodayPercent}) DESC) AS INT)`.mapWith(
            Number
          ),
          totalCount: sql<number>`COUNT(*) OVER ()`.mapWith(Number),
        })
        .from(rankedSpecs)
        .leftJoin(guild, eq(rankedSpecs.characterGuildId, guild.id))
        .where(
          and(
            eq(rankedSpecs.specRank, 1),
            input.spec ? ilike(rankedSpecs.spec, input.spec) : undefined
          )
        )
        .groupBy(
          ({
            id,
            guildId,
            spec,
            name,
            guildName,
            lastRankUpdate,
            realm,
            region,
            todayPercent,
            class: className,
          }) => [
            id,
            guildId,
            spec,
            name,
            guildName,
            lastRankUpdate,
            className,
            realm,
            region,
            todayPercent,
          ]
        )
        .orderBy(({ todayPercent }) => desc(todayPercent))
        .limit(input.limit)
        .offset(input.offset);

      const totalCount = rankedCharactersWithTotalCount[0]?.totalCount ?? 0;

      const rankedCharacters = rankedCharactersWithTotalCount.map(
        (rankWithCount) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
          const { totalCount, todayPercent, ...bestRank } = rankWithCount;

          return {
            ...bestRank,
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
