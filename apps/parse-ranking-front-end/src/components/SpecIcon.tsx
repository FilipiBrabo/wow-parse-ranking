import Image from 'next/image';

type SpecIconProps = {
  spec: string;
  size?: number;
};

export function SpecIcon({ spec, size = 18 }: SpecIconProps) {
  const iconOffset = ICON_OFFSET_BY_SPEC[spec];

  return (
    <Image
      src="https://assets.rpglogs.com/img/warcraft/icons/actors.jpg?v=25"
      width={18}
      height={18}
      style={{
        boxSizing: 'border-box',
        objectPosition: `calc(-${iconOffset}px*${size - 2})0`,
        objectFit: 'cover',
        width: size,
        height: size,
        border: '1px solid black',
      }}
      // TODO: add alt
      alt=""
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
