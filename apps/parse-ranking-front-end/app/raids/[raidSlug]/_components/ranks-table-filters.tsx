import { ClassFilter } from './filters/class-filter';
import { PartitionFilter } from './filters/partition-filter';
import { SpecFilter } from './filters/spec-filter';

interface RankFiltersProps {
  raidSlug: string;
  currentPage: number;
}

export function RankFilters({ raidSlug }: RankFiltersProps) {
  return (
    <div className="flex flex-row gap-2 overflow-auto">
      <PartitionFilter raidSlug={raidSlug} />
      <ClassFilter />
      <SpecFilter />
    </div>
  );
}
