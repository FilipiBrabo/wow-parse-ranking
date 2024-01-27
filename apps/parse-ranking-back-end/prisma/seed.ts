import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // GUILD
  await prisma.guild.upsert({
    where: { name: 'Posto Ipiranga' },
    update: {},
    create: {
      id: 1,
      name: 'Posto Ipiranga',
      serverRegion: 'us',
      serverSlug: 'faerlina',
      wclId: 602367,
    },
  });

  // RAID
  await prisma.raid.upsert({
    where: { name: 'Icecrown Citadel' },
    update: {},
    create: { id: 1, name: 'Icecrown Citadel' },
  });

  await prisma.encounter.upsert({
    where: { name: 'Lord Marrowgar' },
    update: {},
    create: {
      id: 5,
      name: 'Lord Marrowgar',
      wclId: 845,
      difficulty: 4,
      size: 25,
      isActive: true,
      raidId: 1,
    },
  });

  await prisma.encounter.upsert({
    where: { name: 'Lady Deathwhisper' },
    update: {},
    create: {
      id: 6,
      name: 'Lady Deathwhisper',
      wclId: 846,
      difficulty: 4,
      size: 25,
      isActive: true,
      raidId: 1,
    },
  });

  await prisma.encounter.upsert({
    where: { name: 'Deathbringer Saurfang' },
    update: {},
    create: {
      id: 7,
      name: 'Deathbringer Saurfang',
      wclId: 848,
      difficulty: 4,
      size: 25,
      isActive: true,
      raidId: 1,
    },
  });

  await prisma.encounter.upsert({
    where: { name: 'Rotface' },
    update: {},
    create: {
      id: 8,
      name: 'Rotface',
      wclId: 850,
      difficulty: 4,
      size: 25,
      isActive: true,
      raidId: 1,
    },
  });

  await prisma.encounter.upsert({
    where: { name: 'Festergut' },
    update: {},
    create: {
      id: 9,
      name: 'Festergut',
      wclId: 849,
      difficulty: 4,
      size: 25,
      isActive: true,
      raidId: 1,
    },
  });

  await prisma.encounter.upsert({
    where: { name: 'Professor Putricide' },
    update: {},
    create: {
      id: 10,
      name: 'Professor Putricide',
      wclId: 851,
      difficulty: 4,
      size: 25,
      isActive: true,
      raidId: 1,
    },
  });

  await prisma.encounter.upsert({
    where: { name: 'Blood Prince Council' },
    update: {},
    create: {
      id: 11,
      name: 'Blood Prince Council',
      wclId: 852,
      difficulty: 4,
      size: 25,
      isActive: true,
      raidId: 1,
    },
  });

  await prisma.encounter.upsert({
    where: { name: "Blood-Queen Lana'thel" },
    update: {},
    create: {
      id: 12,
      name: "Blood-Queen Lana'thel",
      wclId: 853,
      difficulty: 4,
      size: 25,
      isActive: true,
      raidId: 1,
    },
  });

  await prisma.encounter.upsert({
    where: { name: 'Lich King' },
    update: {},
    create: {
      id: 13,
      name: 'Lich King',
      wclId: 856,
      difficulty: 4,
      size: 25,
      isActive: true,
      raidId: 1,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
