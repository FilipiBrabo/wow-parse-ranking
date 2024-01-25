import { ExternalLink } from './external-link';

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
