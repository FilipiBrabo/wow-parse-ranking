import { Top25CharactersTable } from '../src/components/Top25CharactersTable';

async function getTop25Characters() {
  const response = await fetch(
    'http://localhost:3000/api/rankings/top25?encounterIds=5,6,7,8,9,10,11,12,13'
  );

  if (!response.ok) {
    throw new Error('Failed to fetch top 25 players');
  }

  return response.json();
}

export default async function Index() {
  const topCharacters = await getTop25Characters();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-20000 bg-gray-100 text-gray-900">
      <h1 className="text-4xl font-bold underline mb-4">Top Characters</h1>
      <div>
        <Top25CharactersTable data={topCharacters} />
      </div>
    </div>
  );
}
