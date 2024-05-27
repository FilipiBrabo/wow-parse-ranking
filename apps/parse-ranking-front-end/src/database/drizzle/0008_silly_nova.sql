CREATE TABLE IF NOT EXISTS "partition" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"wcl_id" integer NOT NULL,
	"is_current" boolean DEFAULT false NOT NULL,
	"raid_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "partition" ADD CONSTRAINT "partition_raid_id_Raid_id_fk" FOREIGN KEY ("raid_id") REFERENCES "public"."Raid"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "Raid" DROP COLUMN IF EXISTS "partitions";--> statement-breakpoint
ALTER TABLE "Raid" DROP COLUMN IF EXISTS "active_partition";