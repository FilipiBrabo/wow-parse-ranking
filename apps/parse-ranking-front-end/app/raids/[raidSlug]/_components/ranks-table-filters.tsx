import { Button } from '@parse-ranking/shadcn-ui';
import { FilterX, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import { ClassFilter } from './filters/class-filter';
import { PartitionFilter } from './filters/partition-filter';
import { SpecFilter } from './filters/spec-filter';

export function RankFilters() {
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const currentPage = searchParams.get('page') ?? 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-medium">
          <SlidersHorizontal className="w-6 h-6" />
          Filtros
        </div>
        <Button variant="outline" className="gap-1" asChild>
          <Link
            href={
              Number(currentPage) > 0
                ? `${pathName}?page=${currentPage}`
                : pathName
            }
          >
            <FilterX className="h-4 w-4" />
            Limpar
          </Link>
        </Button>
      </div>
      <div className="flex flex-col gap-2 md:flex-row md:gap-4">
        <PartitionFilter />
        <ClassFilter />
        <SpecFilter />
      </div>
    </div>
  );
}
