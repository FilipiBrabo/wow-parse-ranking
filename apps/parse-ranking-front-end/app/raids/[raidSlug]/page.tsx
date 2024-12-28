import { Suspense } from 'react';
import { z } from 'zod';

import { serverClient } from '../../_trpc/server-client';
import { PAGINATION_LIMIT } from '../../constants';
import { Await } from './_components/await';
import { RaidRanksTable } from './_components/raid-ranks-table';
import { RankFilters } from './_components/ranks-table-filters';

interface PageProps {
  params: Promise<{ raidSlug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Raid(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
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
      <RankFilters raidSlug={params.raidSlug} currentPage={Number(page)} />
      <Suspense
        key={JSON.stringify(searchParams)}
        fallback={<RaidRanksTable loading={true} />}
      >
        <Await promise={ranksPromise}>
          {(ranks) => <RaidRanksTable data={ranks} />}
        </Await>
      </Suspense>
    </div>
  );
}
