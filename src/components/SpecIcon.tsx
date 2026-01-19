import Image from 'next/image';

type SpecIconProps = {
  spec: string;
  wowClass: string;
};

export function SpecIcon({ spec, wowClass }: SpecIconProps) {
  return (
    <Image
      src={`/images/specs/${wowClass.toLowerCase()}-${spec.toLowerCase()}.jpg`}
      height={30}
      width={30}
      quality={100}
      className="border-solid border-1 border-black"
      alt={`Ícone da spec ${spec}`}
    />
  );
}
