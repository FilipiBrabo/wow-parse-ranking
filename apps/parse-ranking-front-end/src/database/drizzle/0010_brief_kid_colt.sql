ALTER TABLE "Ranking" DROP CONSTRAINT "Ranking_characterId_Character_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_characterId_Character_id_fk" FOREIGN KEY ("characterId") REFERENCES "public"."Character"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
