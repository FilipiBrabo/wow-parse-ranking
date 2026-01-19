ALTER TABLE "Raid" RENAME COLUMN "partition" TO "active_partition";--> statement-breakpoint
ALTER TABLE "Raid" ADD COLUMN "partitions" integer[];
