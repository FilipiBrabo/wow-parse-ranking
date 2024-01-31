import Image from 'next/image';

type SpecIconProps = {
  spec: string;
};

export function SpecIcon({ spec }: SpecIconProps) {
  const iconOffset = ICON_OFFSET_BY_SPEC[spec];

  return (
    <Image
      src="https://assets.rpglogs.com/img/warcraft/icons/actors.jpg?v=25"
      width={30}
      height={30}
      style={{
        boxSizing: 'border-box',
        objectPosition: `calc(-${iconOffset}px*${30 - 2})0`,
        objectFit: 'cover',
        width: 30,
        height: 30,
        border: '1px solid black',
      }}
      alt={`Ícone da spec ${spec}`}
    />
  );
}

// https://assets.rpglogs.com/img/warcraft/icons/actors.jpg?v=25
// This are the offsets of each icon
const ICON_OFFSET_BY_SPEC: Record<string, any> = {
  Frost: 3,
  Unholy: 7,
  Balance: 12,
  Feral: 14,
  Beastmastery: 24,
  Survival: 28,
  Marksmanship: 25,
  Arcane: 30,
  Fire: 31,
  FrostMage: 32,
  Retribution: 44,
  Shadow: 50,
  Assassination: 53,
  Combat: 54,
  Subtetly: 57,
  Elemental: 60,
  Enhancement: 61,
  Affliction: 67,
  Demonology: 68,
  Destruction: 69,
  Arms: 73,
  Fury: 75,
};
