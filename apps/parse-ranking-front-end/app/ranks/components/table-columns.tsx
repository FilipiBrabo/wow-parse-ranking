'use client';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

import { CharacterLink } from '../../../src/components/character-link';
import { GuildLink } from '../../../src/components/guild-link';
import { SpecIcon } from '../../../src/components/SpecIcon';
import { getRankColor } from '../../../src/utils/getRankColor';

const columnHelper = createColumnHelper<Character>();

export type Character = {
  name: string;
  guildName: string;
  guildId: number;
  class: string;
  rank: number;
  spec: string;
  realm: string;
  region: string;
  todayPercent: string;
};

export const columns = [
  columnHelper.accessor('rank', {
    header: () => <span>Rank</span>,
    cell: ({ getValue }) => <span>{getValue()}</span>,
  }),
  columnHelper.accessor('spec', {
    header: () => <span>Spec</span>,
    cell: ({ getValue }) => <SpecIcon spec={getValue()} />,
  }),
  columnHelper.accessor('name', {
    header: () => <span>Nome</span>,
    cell: ({ getValue, row }) => {
      const { realm, class: className, region } = row.original;
      return (
        <CharacterLink
          name={getValue()}
          realm={realm}
          class={className}
          region={region}
        />
      );
    },
  }),
  columnHelper.accessor('guildName', {
    header: () => <span>Guild</span>,
    cell: ({ getValue, row }) => (
      <GuildLink guildName={getValue()} guildId={row.original.guildId} />
    ),
  }),
  columnHelper.accessor('todayPercent', {
    header: () => <span>Today %</span>,
    cell: ({ getValue }) => {
      const todayPercent = getValue();
      return (
        <span className={`text-${getRankColor(Number(todayPercent))}`}>
          {Number(todayPercent).toFixed(2)}
        </span>
      );
    },
  }),
] as ColumnDef<Character>[];
