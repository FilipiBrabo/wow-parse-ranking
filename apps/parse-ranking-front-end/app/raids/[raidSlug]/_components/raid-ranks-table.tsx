'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@parse-ranking/shadcn-ui';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { PaginationMenu } from './pagination-menu';

type Paginated<T> = {
  items: T[];
  total: number;
  limit: number;
  offset: number;
};

interface RaidRanksTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: Paginated<TData>;
}

export function RaidRanksTable<TData, TValue>({
  columns,
  data,
}: RaidRanksTableProps<TData, TValue>) {
  const pageCount = Math.ceil(data.limit / data.total) || 1;

  const table = useReactTable({
    data: data.items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount,
    manualFiltering: true,
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Nenhum resultado encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <PaginationMenu
        limit={data.limit}
        offset={data.offset}
        total={data.total}
      />
    </div>
  );
}
