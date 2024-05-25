import { relations } from 'drizzle-orm';
import {
  boolean,
  doublePrecision,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

export const prismaMigrations = pgTable('_prisma_migrations', {
  id: varchar('id', { length: 36 }).primaryKey().notNull(),
  checksum: varchar('checksum', { length: 64 }).notNull(),
  finishedAt: timestamp('finished_at', { withTimezone: true, mode: 'string' }),
  migrationName: varchar('migration_name', { length: 255 }).notNull(),
  logs: text('logs'),
  rolledBackAt: timestamp('rolled_back_at', {
    withTimezone: true,
    mode: 'string',
  }),
  startedAt: timestamp('started_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  appliedStepsCount: integer('applied_steps_count').default(0).notNull(),
});

export const guild = pgTable(
  'Guild',
  {
    id: serial('id').primaryKey().notNull(),
    name: text('name').notNull(),
    wclId: integer('wclId').notNull(),
    serverRegion: text('serverRegion').notNull(),
    serverSlug: text('serverSlug').notNull(),
    lastCharacterUpdate: timestamp('lastCharacterUpdate', {
      precision: 3,
      mode: 'string',
    }),
    isBrazilian: boolean('isBrazilian').default(false).notNull(),
  },
  (table) => {
    return {
      nameKey: uniqueIndex('Guild_name_key').on(table.name),
      wclIdKey: uniqueIndex('Guild_wclId_key').on(table.wclId),
    };
  }
);

export const encounter = pgTable(
  'Encounter',
  {
    id: serial('id').primaryKey().notNull(),
    name: text('name').notNull(),
    wclId: integer('wclId').notNull(),
    size: integer('size').notNull(),
    difficulty: integer('difficulty').notNull(),
    isActive: boolean('isActive').notNull(),
    raidId: integer('raidId')
      .notNull()
      .references(() => raid.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
  },
  (table) => {
    return {
      nameKey: uniqueIndex('Encounter_name_key').on(table.name),
      wclIdKey: uniqueIndex('Encounter_wclId_key').on(table.wclId),
    };
  }
);

export const character = pgTable(
  'Character',
  {
    id: serial('id').primaryKey().notNull(),
    name: text('name').notNull(),
    wclId: integer('wclId'),
    guildId: integer('guildId').references(() => guild.id, {
      onDelete: 'set null',
      onUpdate: 'cascade',
    }),
    class: text('class').notNull(),
    serverRegion: text('serverRegion').notNull(),
    serverSlug: text('serverSlug').notNull(),
    lastRankUpdate: timestamp('lastRankUpdate', {
      precision: 3,
      mode: 'string',
    }),
    isActive: boolean('isActive').default(true).notNull(),
    isBrazilian: boolean('isBrazilian').default(true).notNull(),
  },
  (table) => {
    return {
      nameServerIdx: uniqueIndex('name_server_idx').on(
        table.name,
        table.serverSlug
      ),
      wclIdKey: uniqueIndex('Character_wclId_key').on(table.wclId),
    };
  }
);

export const raid = pgTable(
  'Raid',
  {
    id: serial('id').primaryKey().notNull(),
    name: text('name').notNull(),
    partitions: integer('partitions').array(),
    activePartition: integer('active_partition').notNull(),
    slug: text('slug'),
    expansionId: integer('expansionId'),
    isActive: boolean('is_active').notNull().default(false),
  },
  (table) => {
    return {
      nameKey: uniqueIndex('Raid_name_key').on(table.name),
    };
  }
);

export const ranking = pgTable(
  'Ranking',
  {
    id: serial('id').primaryKey().notNull(),
    characterId: integer('characterId')
      .notNull()
      .references(() => character.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      }),
    todayPercent: doublePrecision('todayPercent').notNull(),
    lockedIn: boolean('lockedIn').notNull(),
    spec: text('spec').notNull(),
    reportCode: text('reportCode').notNull(),
    duration: integer('duration').notNull(),
    amount: doublePrecision('amount').notNull(),
    encounterId: integer('encounterId')
      .notNull()
      .references(() => encounter.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      }),
    partition: integer('partition').notNull(),
    fightId: integer('fightId'),
  },
  (table) => {
    return {
      characterIdEncounterIdSpecPartitionKey: uniqueIndex(
        'Ranking_characterId_encounterId_spec_partition_key'
      ).on(table.characterId, table.spec, table.encounterId, table.partition),
    };
  }
);

export const expansion = pgTable('Expansion', {
  id: serial('id').primaryKey(),
  name: text('name'),
  order: integer('order').default(0),
  slug: text('slug'),
});

// Relations
export const characterRelations = relations(character, ({ one, many }) => ({
  ranking: many(ranking),
  guild: one(guild, {
    fields: [character.guildId],
    references: [guild.id],
  }),
}));

export const guildRelations = relations(guild, ({ many }) => ({
  character: many(character),
}));

export const rankingRelations = relations(ranking, ({ one }) => ({
  character: one(character, {
    fields: [ranking.characterId],
    references: [character.id],
  }),
  encounter: one(encounter, {
    fields: [ranking.encounterId],
    references: [encounter.id],
  }),
}));

export const encounterRelations = relations(encounter, ({ one, many }) => ({
  ranking: many(ranking),
  raid: one(raid, {
    fields: [encounter.raidId],
    references: [raid.id],
  }),
}));

export const raidRelations = relations(raid, ({ one, many }) => ({
  encounter: many(encounter),
  expansion: one(expansion, {
    fields: [raid.expansionId],
    references: [expansion.id],
  }),
}));

export const expansionRelations = relations(expansion, ({ many }) => ({
  raid: many(raid),
}));
