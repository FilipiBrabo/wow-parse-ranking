import { Suspense } from 'react';
import { z } from 'zod';

import { serverClient } from '../../_trpc/server-client';
import { PAGINATION_LIMIT } from '../../constants';
import { Await } from './_components/await';
import { RaidRanksTable } from './_components/raid-ranks-table';
import { RankFilters } from './_components/ranks-table-filters';
import { columns } from './_components/table-columns';
import { TableSkeleton } from './_components/table-skeleton';

interface PageProps {
  params: { raidSlug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}
export default async function Raid({ searchParams, params }: PageProps) {
  const { page, ...filters } = searchParams;

  const offset = z.coerce
    .number()
    .positive()
    .optional()
    .transform((page) => (page ? page - 1 : 0))
    .transform((pageIndex) => pageIndex * PAGINATION_LIMIT)
    .parse(page);

  const ranksPromise = serverClient.rank.getRanks({
    // TODO: use zod to parse searchParams
    ...filters,
    partition: filters.partition ? Number(filters.partition) : undefined,
    offset,
    raidSlug: params.raidSlug,
  });

  return (
    <div className="space-y-4">
      <RankFilters />
      <Suspense key={JSON.stringify(searchParams)} fallback={<TableSkeleton />}>
        <Await promise={ranksPromise}>
          {(ranks) => <RaidRanksTable columns={columns} data={ranks} />}
        </Await>
      </Suspense>
    </div>
  );
}
