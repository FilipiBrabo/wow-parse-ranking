import { getClassColor } from '../utils/getClassColor';

type CharacterLinkProps = {
  name: string;
  className: string;
  realm: string;
  region: string;
};

export function CharacterLink({
  name,
  className,
  realm,
  region,
}: CharacterLinkProps) {
  return (
    <a
      target="_blank"
      style={{ color: getClassColor(className) }}
      href={`https://classic.warcraftlogs.com/character/${region.toLowerCase()}/${realm.toLowerCase()}/${name.toLowerCase()}`}
    >
      {name}
    </a>
  );
}
