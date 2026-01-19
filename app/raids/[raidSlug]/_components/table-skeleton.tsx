'use client';

import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { columns } from './table-columns';

export function TableSkeleton() {
  const table = useReactTable({
    data: [] as any,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    // manualPagination: true,
    // pageCount,
    // manualFiltering: true,
  });

  const rows = Array.from({ length: 10 }, (_, i) => i);

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
          {rows.map((row) => (
            <TableRow key={row}>
              {columns.map((column) => (
                <TableCell key={column.id}>
                  <Skeleton
                    key={column.id}
                    className="h-6 w-full"
                    style={{
                      maxWidth: column.maxSize,
                      minWidth: column.minSize,
                    }}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
