/*
  Warnings:

  - Made the column `serverRegion` on table `Character` required. This step will fail if there are existing NULL values in that column.
  - Made the column `serverSlug` on table `Character` required. This step will fail if there are existing NULL values in that column.
  - Made the column `characterId` on table `Ranking` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Ranking" DROP CONSTRAINT "Ranking_characterId_fkey";

-- AlterTable
ALTER TABLE "Character" ALTER COLUMN "serverRegion" SET NOT NULL,
ALTER COLUMN "serverSlug" SET NOT NULL;

-- AlterTable
ALTER TABLE "Ranking" ADD COLUMN     "fightId" INTEGER,
ALTER COLUMN "characterId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
