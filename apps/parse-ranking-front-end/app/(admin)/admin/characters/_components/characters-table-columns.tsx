'use client';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { CharacterLink } from 'apps/parse-ranking-front-end/src/components/character-link';
import dayjs from 'dayjs';

import { RouterOutput } from '../../../../../src/server';
import { Button } from 'libs/shadcn-ui/src/components/ui/button';
import { PencilIcon } from 'lucide-react';
import { CharactersTableActions } from './characters-table-actions';

export type Character = RouterOutput['characters']['listAll']['items'][number];

const columnHelper = createColumnHelper<Character>();

export const columns = [
  columnHelper.accessor('name', {
    header: () => <span>Nome</span>,
    cell: ({ getValue, row }) => {
      const { class: wowClass, serverSlug, serverRegion } = row.original;

      return (
        <CharacterLink
          name={getValue()}
          class={wowClass}
          realm={serverSlug}
          region={serverRegion}
        />
      );
    },
  }),
  columnHelper.accessor('guild.name', {
    header: () => <span>Guild</span>,
    cell: ({ getValue }) => {
      return <div>{getValue()}</div>;
    },
  }),

  columnHelper.accessor('isBrazilian', {
    header: () => <span>Brasileiro</span>,
    cell: ({ getValue }) => {
      return <div>{getValue() ? 'Sim' : 'Não'}</div>;
    },
  }),

  columnHelper.accessor('lastRankUpdate', {
    header: () => <span>Última atualização do rank</span>,
    cell: ({ getValue }) => {
      return <div>{dayjs(getValue()).format('DD/MM/YYYY hh:mm')}</div>;
    },
  }),
  columnHelper.display({
    id: 'actions',
    cell: ({ row }) => {
      return <CharactersTableActions row={row} />;
    },
  }),
] as ColumnDef<Character>[];
