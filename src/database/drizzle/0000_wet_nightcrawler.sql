-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"checksum" varchar(64) NOT NULL,
	"finished_at" timestamp with time zone,
	"migration_name" varchar(255) NOT NULL,
	"logs" text,
	"rolled_back_at" timestamp with time zone,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"applied_steps_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Guild" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"wclId" integer NOT NULL,
	"serverRegion" text NOT NULL,
	"serverSlug" text NOT NULL,
	"lastCharacterUpdate" timestamp(3),
	"isBrazilian" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Encounter" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"wclId" integer NOT NULL,
	"size" integer NOT NULL,
	"difficulty" integer NOT NULL,
	"isActive" boolean NOT NULL,
	"raidId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Character" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"wclId" integer,
	"guildId" integer,
	"class" text NOT NULL,
	"serverRegion" text NOT NULL,
	"serverSlug" text NOT NULL,
	"lastRankUpdate" timestamp(3),
	"isActive" boolean DEFAULT true NOT NULL,
	"isBrazilian" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Raid" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"partition" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Ranking" (
	"id" serial PRIMARY KEY NOT NULL,
	"characterId" integer NOT NULL,
	"todayPercent" double precision NOT NULL,
	"lockedIn" boolean NOT NULL,
	"spec" text NOT NULL,
	"reportCode" text NOT NULL,
	"duration" integer NOT NULL,
	"amount" double precision NOT NULL,
	"encounterId" integer NOT NULL,
	"partition" integer NOT NULL,
	"fightId" integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Guild_name_key" ON "Guild" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Guild_wclId_key" ON "Guild" ("wclId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Encounter_name_key" ON "Encounter" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Encounter_wclId_key" ON "Encounter" ("wclId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Character_name_key" ON "Character" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Character_wclId_key" ON "Character" ("wclId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Raid_name_key" ON "Raid" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Ranking_characterId_encounterId_spec_partition_key" ON "Ranking" ("characterId","spec","encounterId","partition");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Encounter" ADD CONSTRAINT "Encounter_raidId_fkey" FOREIGN KEY ("raidId") REFERENCES "public"."Raid"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Character" ADD CONSTRAINT "Character_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "public"."Guild"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "public"."Encounter"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "public"."Character"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

