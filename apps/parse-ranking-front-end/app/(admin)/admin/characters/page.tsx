import { serverClient } from 'apps/parse-ranking-front-end/app/_trpc/server-client';
import { Await } from 'apps/parse-ranking-front-end/src/components/await';
import { SearchInput } from 'apps/parse-ranking-front-end/src/components/search-input';
import { AdminTable } from 'apps/parse-ranking-front-end/src/components/table';
import { Suspense } from 'react';

import { CharactersTable } from './_components/characters-table';
import { CreateCharacterButton } from './_components/create-character-button';

export default async function CharactersPage(props: {
  searchParams: Promise<{ query: string; page: string }>;
}) {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={'text-2xl'}>Personagens</h1>
      </div>
      <div className="mt-4 mb-4 flex items-center justify-between gap-2 md:mt-8">
        <SearchInput placeholder="Pesquisar personagens..." />
        <CreateCharacterButton />
      </div>
      <CharactersTable searchParams={props.searchParams} />
    </div>
  );
}
