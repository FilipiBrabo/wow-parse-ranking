type GuildLinkProps = {
  guildName: string;
  guildId: number;
};

export function GuildLink({ guildName, guildId }: GuildLinkProps) {
  return (
    <a
      target="_blank"
      href={`https://classic.warcraftlogs.com/guild/id/${guildId}`}
    >
      {guildName}
    </a>
  );
}
