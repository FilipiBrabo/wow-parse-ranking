-- CreateTable
CREATE TABLE "Character" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "wclId" INTEGER,
    "guildId" INTEGER,
    "class" TEXT,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guild" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "wclId" INTEGER NOT NULL,
    "serverRegion" TEXT NOT NULL,
    "serverSlug" TEXT NOT NULL,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ranking" (
    "id" SERIAL NOT NULL,
    "characterId" INTEGER,
    "todayPercent" DOUBLE PRECISION NOT NULL,
    "lockedIn" BOOLEAN NOT NULL,
    "spec" TEXT NOT NULL,
    "reportCode" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "encounterId" INTEGER NOT NULL,

    CONSTRAINT "Ranking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Encounter" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "wclId" INTEGER NOT NULL,
    "size" INTEGER NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "Encounter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Test" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Character_name_key" ON "Character"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Character_wclId_key" ON "Character"("wclId");

-- CreateIndex
CREATE UNIQUE INDEX "Guild_name_key" ON "Guild"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Guild_wclId_key" ON "Guild"("wclId");

-- CreateIndex
CREATE UNIQUE INDEX "Ranking_characterId_encounterId_reportCode_key" ON "Ranking"("characterId", "encounterId", "reportCode");

-- CreateIndex
CREATE UNIQUE INDEX "Encounter_name_key" ON "Encounter"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Encounter_wclId_key" ON "Encounter"("wclId");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "Encounter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
