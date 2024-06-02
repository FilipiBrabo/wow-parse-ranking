import { and, eq, sql } from 'drizzle-orm';

import { getClient } from '../../apollo/client';
import { db } from '../../database/drizzle/db';
import {
  character as dbCharacter,
  partition,
  ranking,
} from '../../database/drizzle/schema';
import { getWclCharacterRankingsQuery } from '../gql-queries';
import { publicProcedure, router } from '../trpc';
import { WclCharacterRankingsResponse } from '../types';
import { getBestRanks } from '../utils';

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

  const apolloClient = getClient();
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
