import {
  and,
  asc,
  count,
  eq,
  getTableColumns,
  ilike,
  or,
  sql,
} from 'drizzle-orm';
import { z } from 'zod';

import { getApolloClient } from '../../apollo/client';
import { db } from '../../database/drizzle/db';
import {
  character as dbCharacter,
  guild,
  partition,
  ranking,
} from '../../database/drizzle/schema';
import { getWclCharacterRankingsQuery } from '../gql-queries';
import { publicProcedure, router } from '../trpc';
import { WclCharacterRankingsResponse } from '../types';
import { getBestRanks } from '../utils';
import { characterSchema } from '../../lib/schemas/character-schema';

type Characters = Awaited<ReturnType<typeof getCharactersToUpdate>>;
export type Character = Characters[number];
export type EncounterWithRankings = Awaited<
  ReturnType<typeof getActiveEncounters>
>;

export const charactersRouter = router({
  updateRanks: publicProcedure.query(async () => {
    const charactersToUpdate = await getCharactersToUpdate();

    const activeEncounters = await getActiveEncounters();

    await Promise.all(
      charactersToUpdate.map(async (character) => {
        return updateCharacterEncountersRank(character, activeEncounters);
      })
    );

    return charactersToUpdate;
  }),

  listAll: publicProcedure
    .input(
      z.object({
        query: z.string(),
        page: z.number(),
      })
    )
    .query(async ({ input }) => {
      const LIMIT = 15;
      const offset = (input.page - 1) * LIMIT;

      const characters = await db
        .select({
          ...getTableColumns(dbCharacter),
          guild: {
            ...getTableColumns(guild),
          },
        })
        .from(dbCharacter)
        .leftJoin(guild, eq(dbCharacter.guildId, guild.id))
        .where(
          or(
            ilike(dbCharacter.name, `%${input.query}%`),
            ilike(dbCharacter.serverRegion, `%${input.query}%`),
            ilike(guild.name, `%${input.query}%`)
          )
        )
        .orderBy(asc(dbCharacter.name))
        .limit(LIMIT)
        .offset(offset);

      const total = await db
        .select({ count: count() })
        .from(dbCharacter)
        .leftJoin(guild, eq(dbCharacter.guildId, guild.id))
        .where(
          or(
            ilike(dbCharacter.name, `%${input.query}%`),
            ilike(dbCharacter.serverRegion, `%${input.query}%`),
            ilike(guild.name, `%${input.query}%`)
          )
        );

      return {
        items: characters,
        limit: LIMIT,
        offset,
        total: total[0]?.count ?? 0,
      };
    }),
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(dbCharacter).where(eq(dbCharacter.id, input.id));
    }),
  update: publicProcedure
    .input(z.object({ id: z.number(), data: characterSchema }))
    .mutation(async ({ input }) => {
      await db
        .update(dbCharacter)
        .set(input.data)
        .where(eq(dbCharacter.id, input.id));
    }),

  create: publicProcedure
    .input(z.object({ data: characterSchema }))
    .mutation(async ({ input }) => {
      await db.insert(dbCharacter).values(input.data);
    }),
});

async function getCharactersToUpdate() {
  return await db
    .select()
    .from(dbCharacter)
    .where(
      and(eq(dbCharacter.isActive, true), eq(dbCharacter.isBrazilian, true))
    )
    .orderBy(sql`${dbCharacter.lastRankUpdate} asc nulls first`)
    .limit(15);
}

async function getActiveEncounters() {
  // TODO: only consider active raids
  const encounters = await db.query.encounter.findMany({
    with: {
      raid: {
        with: { partition: { where: eq(partition.isCurrent, true) } },
      },
    },
    where: (encounter, { eq }) => eq(encounter.isActive, true),
  });

  // TODO: Can we do this filter in SQL?
  // Remove raids with no active encounter and raids that doesn't have an active partition
  const filteredEncounters = encounters
    .filter((e) => !!e.raid.partition.length)
    .map((e) => ({
      ...e,
      // This non-null assertion is safe because of the filter above
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      raid: { ...e.raid, partition: e.raid.partition[0]! },
    }));

  return filteredEncounters;
}

async function updateCharacterEncountersRank(
  character: Character,
  activeEncounters: EncounterWithRankings
) {
  const wclCharacterEncounterRankings = await fetchWclCharacterRankings(
    character,
    activeEncounters
  );

  if (wclCharacterEncounterRankings) {
    const bestCharacterRanks = getBestRanks(
      wclCharacterEncounterRankings,
      activeEncounters
    );

    // TODO: Use excluded instead of loop
    // See: https://orm.drizzle.team/learn/guides/upsert
    for (const rank of bestCharacterRanks) {
      await db
        .insert(ranking)
        .values({
          ...rank,
          partition: rank.partition.wclId,
          characterId: character.id,
        })
        .onConflictDoUpdate({
          target: [
            ranking.characterId,
            ranking.spec,
            ranking.encounterId,
            ranking.partition,
          ],
          set: {
            ...rank,
            characterId: character.id,
            partition: rank.partition.wclId,
          },
        });
    }
  }

  await db
    .update(dbCharacter)
    .set({
      lastRankUpdate: new Date().toISOString(),
    })
    .where(eq(dbCharacter.id, character.id));
}

async function fetchWclCharacterRankings(
  character: Character,
  encounters: EncounterWithRankings
) {
  const { query, variables } = getWclCharacterRankingsQuery(
    character,
    encounters
  );

  const apolloClient = getApolloClient();
  // TODO: handle error
  const {
    data: {
      characterData: { character: characterWithRanks },
    },
  } = await apolloClient.query<WclCharacterRankingsResponse>({
    query,
    variables,
  });

  return characterWithRanks;
}
