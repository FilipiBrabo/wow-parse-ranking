import { ExternalLink } from './external-link';

type CharacterLinkProps = {
  name: string;
  class: string;
  realm: string;
  region: string;
};

export function CharacterLink({
  name,
  class: className,
  realm,
  region,
}: CharacterLinkProps) {
  const cssClassName = className
    .split(/(?=[A-Z])/)
    .join('-')
    .toLowerCase();

  return (
    <ExternalLink
      href={`https://classic.warcraftlogs.com/character/${region.toLowerCase()}/${realm.toLowerCase()}/${name.toLowerCase()}`}
      title={name}
      className={`text-${cssClassName}`}
    />
  );
}
