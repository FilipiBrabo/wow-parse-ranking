export const CLASS_BY_WCL_CLASS_ID: Record<number, string> = {
  1: 'Death Knight',
  2: 'Druid',
  3: 'Hunter',
  4: 'Mage',
  6: 'Paladin',
  7: 'Priest',
  8: 'Rogue',
  9: 'Shaman',
  10: 'Warlock',
  11: 'Warrior',
};

export const INVALID_SPECS_BY_CLASS_ID: Record<string, string[]> = {
  11: ['Gladiator'],
  6: ['Justicar', 'Protection', 'Holy'],
  9: ['Restoration'],
  7: ['Discipline', 'Holy'],
  2: ['Guardian', 'Restoration', 'Warden'],
  1: ['Runeblade'],
};
