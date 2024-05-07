import { z } from 'zod';

import { serverClient } from '../_trpc/serverClient';
import { RanksTable } from './components/ranks-table';
import { columns } from './components/table-columns';

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const DEFAULT_LIMIT = 15;

export default async function RanksPage({ searchParams }: PageProps) {
  const { page, ...filters } = searchParams;

  const offset = z.coerce
    .number()
    .positive()
    .optional()
    .transform((page) => (page ? page - 1 : 0))
    .transform((pageIndex) => pageIndex * DEFAULT_LIMIT)
    .parse(page);

  const ranks = await serverClient.rank.list({
    // TODO: use zod to parse searchParams
    ...filters,
    partition: filters.partition ? Number(filters.partition) : undefined,
    offset,
  });

  return <RanksTable columns={columns} data={ranks} />;
}
