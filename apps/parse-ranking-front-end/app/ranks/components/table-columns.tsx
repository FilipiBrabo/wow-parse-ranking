'use client';

import { createColumnHelper } from '@tanstack/react-table';

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
  rank: string;
  spec: string;
  realm: string;
  region: string;
};

export const columns = [
  columnHelper.display({
    id: 'order',
    cell: (props) => <span>{props.row.index + 1}</span>,
  }),
  columnHelper.accessor('spec', {
    header: () => <span>Spec</span>,
    cell: ({ getValue }) => <SpecIcon spec={getValue()} size={30} />,
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
  columnHelper.accessor('rank', {
    header: () => <span>Today %</span>,
    cell: ({ getValue }) => {
      const rank = getValue();
      return (
        <span className={`text-${getRankColor(Number(rank))}`}>
          {Number(rank).toFixed(2)}
        </span>
      );
    },
  }),
];
