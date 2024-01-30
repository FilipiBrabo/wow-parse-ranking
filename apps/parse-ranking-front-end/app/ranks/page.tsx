import { z } from 'zod';

import { RanksTable } from './components/ranks-table';
import { Character, columns } from './components/table-columns';

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

type PaginatedCharacters = {
  items: Character[];
  total: number;
  limit: number;
  offset: number;
};

const DEFAULT_LIMIT = 15;

async function getRanks(
  pageIndex: number,
  filters: Record<string, string | string[] | undefined>
): Promise<PaginatedCharacters> {
  const offset = pageIndex * DEFAULT_LIMIT;

  const searchParams = new URLSearchParams();
  searchParams.set('offset', String(offset));

  for (const [key, value] of Object.entries(filters)) {
    if (!value || Array.isArray(value)) continue;
    searchParams.set(key, value);
  }

  console.log(
    'api endpoint: ',
    `${process.env.API_BASE_PATH}/rankings/icc?${searchParams.toString()}`
  );
  const response = await fetch(
    `${process.env.API_BASE_PATH}/rankings/icc?${searchParams.toString()}`,
    { next: { revalidate: 0 } }
  );

  console.log('response', response.ok);

  if (!response.ok) {
    throw new Error('Failed to fetch');
  }

  return response.json();
}

export default async function RanksPage({ searchParams }: PageProps) {
  const { page, ...filters } = searchParams;

  const pageIndex = z.coerce
    .number()
    .positive()
    .optional()
    .transform((page) => (page ? page - 1 : 0))
    .parse(page);

  const data = await getRanks(pageIndex, filters);

  console.log({ data });
  return <RanksTable columns={columns} data={data} />;
}
