'use client';

import {
  cn,
  Skeleton,
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
import React from 'react';

type Paginated<T> = {
  items: T[];
  total: number;
  limit: number;
  offset: number;
};

interface RaidRanksTableProps<TData> {
  data: Paginated<TData>;
  loading?: false;
  columns: ColumnDef<TData>[];
}

interface RaidRanksTableSkeletonProps<TData> {
  data?: never;
  loading: true;
  columns: ColumnDef<TData>[];
}

export function AdminTable<TData>({
  columns,
  loading,
  data,
}: RaidRanksTableProps<TData> | RaidRanksTableSkeletonProps<TData>) {
  const pageCount = data ? Math.ceil(data.limit / data.total) : 1;

  const tableData = React.useMemo(
    () => (loading ? Array(15).fill({}) : data.items),
    [loading, data]
  );

  const tableColumns = React.useMemo(
    () =>
      loading
        ? columns.map((column) => ({
            ...column,
            cell: () => <Skeleton className={cn('h-8 w-full p-2')} />,
          }))
        : columns,
    [columns, loading]
  );

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount,
    manualFiltering: true,
    meta: {
      totalRows: data?.total || 0,
    },
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="whitespace-nowrap">
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
      {/* <PaginationMenu
        limit={data?.limit || 0}
        offset={data?.offset || 0}
        total={data?.total || 0}
      /> */}
    </div>
  );
}
