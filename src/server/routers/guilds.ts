import { eq, sql } from 'drizzle-orm';
import { uniqBy } from 'lodash';

import { getApolloClient } from '../../apollo/client';
import { db } from '../../database/drizzle/db';
import {
  character as characterTable,
  guild as guildTable,
} from '../../database/drizzle/schema';
import { getGuildReportsQuery } from '../gql-queries';
import { publicProcedure, router } from '../trpc';
import { WclGuildReportsResponse } from '../types';

const ONE_WEEK_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;

export type Guild = NonNullable<Awaited<ReturnType<typeof getGuildToUpdate>>>;

export const guildsRouter = router({
  updateCharacters: publicProcedure.query(async () => {
    const guild = await getGuildToUpdate();

    if (!guild) return;

    const guildReports = await getGuildReports(guild);

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

    // TODO: Use excluded instead of loop
    // See: https://orm.drizzle.team/learn/guides/upsert
    for (const character of uniqueCharacters) {
      await db
        .insert(characterTable)
        .values(character)
        .onConflictDoUpdate({
          target: [characterTable.name, characterTable.serverSlug],
          set: {
            isActive: true,
          },
        });
    }

    await db
      .update(guildTable)
      .set({ lastCharacterUpdate: new Date().toISOString() })
      .where(eq(guildTable.id, guild.id));

    return characters;
  }),
});

async function getGuildToUpdate() {
  return await db.query.guild.findFirst({
    where: eq(guildTable.isBrazilian, true),
    orderBy: sql`${guildTable.lastCharacterUpdate} asc nulls first`,
  });
}

async function getGuildReports(guild: Guild) {
  const { query, variables } = getGuildReportsQuery(guild);

  const apolloClient = getApolloClient();

  // TODO: handle error
  const {
    data: {
      guildData: {
        guild: {
          attendance: { data: reports },
        },
      },
    },
  } = await apolloClient.query<WclGuildReportsResponse>({
    query,
    variables,
  });

  return reports;
}
