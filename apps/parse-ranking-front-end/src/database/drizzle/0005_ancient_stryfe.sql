DROP INDEX IF EXISTS "Character_name_key";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "name_server_idx" ON "Character" ("name","serverSlug");