import { serverClient } from 'apps/parse-ranking-front-end/app/_trpc/server-client';
import { Await } from 'apps/parse-ranking-front-end/src/components/await';
import { AdminTable } from 'apps/parse-ranking-front-end/src/components/table';
import { Suspense } from 'react';

import { columns } from './characters-table-columns';

export async function CharactersTable({
  searchParams,
}: {
  searchParams: Promise<{ query: string; page: string }>;
}) {
  const query = (await searchParams).query || '';
  const currentPage = Number((await searchParams).page) || 1;

  const characters = serverClient.characters.listAll({
    page: currentPage,
    query,
  });

  return (
    <Suspense
      key={query + currentPage}
      fallback={<AdminTable columns={columns} loading={true} />}
    >
      <Await promise={characters}>
        {(characters) => <AdminTable columns={columns} data={characters} />}
      </Await>
    </Suspense>
  );
}
