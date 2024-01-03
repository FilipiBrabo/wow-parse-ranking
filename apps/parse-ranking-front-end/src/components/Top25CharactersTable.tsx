'use client';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { getRankColor } from '../utils/getRankColor';
import { CharacterLink } from './CharacterLink';
import { GuildLink } from './GuildLink';
import { SpecIcon } from './SpecIcon';

type Character = {
  name: string;
  guildName: string;
  guildId: number;
  className: string;
  rank: string;
  spec: string;
  realm: string;
  region: string;
};

const columnHelper = createColumnHelper<Character>();

type AllStarsTableProps = {
  data: Character[];
};

export function Top25CharactersTable({ data }: AllStarsTableProps) {
  const columns = [
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
        const { realm, className, region } = row.original;
        return (
          <CharacterLink
            name={getValue()}
            realm={realm}
            className={className}
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
      header: () => <span>Rank</span>,
      cell: ({ getValue }) => {
        const rank = getValue();
        return (
          <span style={{ color: getRankColor(Number(rank)) }}>
            {Number(rank).toFixed(2)}
          </span>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
