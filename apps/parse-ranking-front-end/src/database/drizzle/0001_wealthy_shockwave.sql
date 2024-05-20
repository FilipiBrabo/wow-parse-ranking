CREATE TABLE IF NOT EXISTS "Expansion" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text
);
--> statement-breakpoint
ALTER TABLE "Encounter" DROP CONSTRAINT "Encounter_raidId_fkey";
--> statement-breakpoint
ALTER TABLE "Character" DROP CONSTRAINT "Character_guildId_fkey";
--> statement-breakpoint
ALTER TABLE "Ranking" DROP CONSTRAINT "Ranking_encounterId_fkey";
--> statement-breakpoint
ALTER TABLE "Ranking" DROP CONSTRAINT "Ranking_characterId_fkey";
--> statement-breakpoint
ALTER TABLE "Raid" ADD COLUMN "expansionId" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Encounter" ADD CONSTRAINT "Encounter_raidId_Raid_id_fk" FOREIGN KEY ("raidId") REFERENCES "Raid"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Character" ADD CONSTRAINT "Character_guildId_Guild_id_fk" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_characterId_Character_id_fk" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_encounterId_Encounter_id_fk" FOREIGN KEY ("encounterId") REFERENCES "Encounter"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
