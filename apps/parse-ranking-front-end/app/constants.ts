export const ICC_RANKINGS_TAG = 'icc-rankings-tag';

export const WOW_CLASSES = [
  {
    id: 'DeathKnight',
    label: 'Death Knight',
    icon: '/images/classes/deathknight.jpg',
    specs: [
      {
        id: 'BloodDPS',
        label: 'Blood DPS',
        icon: '/images/specs/deathknight-blooddps.jpg',
      },
      {
        id: 'Frost',
        label: 'Frost',
        icon: '/images/specs/deathknight-frost.jpg',
      },
      {
        id: 'Unholy',
        label: 'Unholy',
        icon: '/images/specs/deathknight-unholy.jpg',
      },
    ],
  },
  {
    id: 'Druid',
    label: 'Druid',
    icon: '/images/classes/druid.jpg',
    specs: [
      {
        id: 'Balance',
        label: 'Balance',
        icon: '/images/specs/druid-balance.jpg',
      },
      {
        id: 'Feral',
        label: 'Feral',
        icon: '/images/specs/druid-feral.jpg',
      },
    ],
  },
  {
    id: 'Hunter',
    label: 'Hunter',
    icon: '/images/classes/hunter.jpg',
    specs: [
      {
        id: 'Marksmanship',
        label: 'Marksmanship',
        icon: '/images/specs/hunter-marksmanship.jpg',
      },
      {
        id: 'Survival',
        label: 'Survival',
        icon: '/images/specs/hunter-survival.jpg',
      },
    ],
  },
  {
    id: 'Mage',
    label: 'Mage',
    icon: '/images/classes/mage.jpg',
    specs: [
      {
        id: 'Arcane',
        label: 'Arcane',
        icon: '/images/specs/mage-arcane.jpg',
      },
      {
        id: 'Fire',
        label: 'Fire',
        icon: '/images/specs/mage-fire.jpg',
      },
    ],
  },
  {
    id: 'Paladin',
    label: 'Paladin',
    icon: '/images/classes/paladin.jpg',
    specs: [
      {
        id: 'Retribution',
        label: 'Retribution',
        icon: '/images/specs/paladin-retribution.jpg',
      },
    ],
  },
  {
    id: 'Priest',
    label: 'Priest',
    icon: '/images/classes/priest.jpg',
    specs: [
      {
        id: 'Shadow',
        label: 'Shadow',
        icon: '/images/specs/priest-shadow.jpg',
      },
    ],
  },
  {
    id: 'Rogue',
    label: 'Rogue',
    icon: '/images/classes/rogue.jpg',
    specs: [
      {
        id: 'Assassination',
        label: 'Assassination',
        icon: '/images/specs/rogue-assassination.jpg',
      },
      {
        id: 'Combat',
        label: 'Combat',
        icon: '/images/specs/rogue-combat.jpg',
      },
    ],
  },
  {
    id: 'Shaman',
    label: 'Shaman',
    icon: '/images/classes/shaman.jpg',
    specs: [
      {
        id: 'Elemental',
        label: 'Elemental',
        icon: '/images/specs/shaman-elemental.jpg',
      },
      {
        id: 'Enhancement',
        label: 'Enhancement',
        icon: '/images/specs/shaman-enhancement.jpg',
      },
    ],
  },
  {
    id: 'Warlock',
    label: 'Warlock',
    icon: '/images/classes/warlock.jpg',
    specs: [
      {
        id: 'Affliction',
        label: 'Affliction',
        icon: '/images/specs/warlock-affliction.jpg',
      },
      {
        id: 'Demonology',
        label: 'Demonology',
        icon: '/images/specs/warlock-demonology.jpg',
      },
    ],
  },
  {
    id: 'Warrior',
    label: 'Warrior',
    icon: '/images/classes/warrior.jpg',
    specs: [
      {
        id: 'Arms',
        label: 'Arms',
        icon: '/images/specs/warrior-arms.jpg',
      },
      {
        id: 'Fury',
        label: 'Fury',
        icon: '/images/specs/warrior-fury.jpg',
      },
    ],
  },
] as const;

export const PAGINATION_LIMIT = 15;
