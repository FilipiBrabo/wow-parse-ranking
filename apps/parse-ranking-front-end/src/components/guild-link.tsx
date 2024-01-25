import { ExternalLink } from './external-link';

type GuildLinkProps = {
  guildName: string;
  guildId: number;
};

export function GuildLink({ guildName, guildId }: GuildLinkProps) {
  return (
    <ExternalLink
      href={`https://classic.warcraftlogs.com/guild/id/${guildId}`}
      title={guildName}
    />
  );
}
