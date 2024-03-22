/*
  Warnings:

  - A unique constraint covering the columns `[characterId,encounterId,spec,partition]` on the table `Ranking` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Ranking_characterId_encounterId_spec_key";

-- CreateIndex
CREATE UNIQUE INDEX "Ranking_characterId_encounterId_spec_partition_key" ON "Ranking"("characterId", "encounterId", "spec", "partition");
