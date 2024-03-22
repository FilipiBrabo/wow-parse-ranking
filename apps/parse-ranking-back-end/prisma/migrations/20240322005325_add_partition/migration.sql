-- AlterTable
ALTER TABLE "Raid" ADD COLUMN     "partition" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Ranking" ADD COLUMN     "partition" INTEGER NOT NULL DEFAULT 0;
