import { z } from 'zod';

import { serverClient } from '../../_trpc/serverClient';
import { PAGINATION_LIMIT } from '../../constants';
import { RanksTable } from '../../ranks/components/ranks-table';
import { columns } from './_components/table-columns';

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

  const ranks = await serverClient.rank.getRanks({
    // TODO: use zod to parse searchParams
    ...filters,
    partition: filters.partition ? Number(filters.partition) : undefined,
    offset,
    raidSlug: params.raidSlug,
  });

  return <RanksTable columns={columns} data={ranks} />;
}
