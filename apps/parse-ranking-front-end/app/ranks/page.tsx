import { RanksTable } from './components/ranks-table';
import { Character, columns } from './components/table-columns';

async function getRanks(): Promise<Character[]> {
  const response = await fetch(`${process.env.API_BASE_PATH}/rankings/icc`);

  if (!response.ok) {
    throw new Error('Failed to fetch top 25 players');
  }

  return response.json();
}

export default async function RanksPage() {
  const data = await getRanks();
  return <RanksTable columns={columns} data={data} />;
}
