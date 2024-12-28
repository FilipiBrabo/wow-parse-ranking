'use client';
import { Button } from '@parse-ranking/shadcn-ui';
import { ClassFilter } from './filters/class-filter';
import { PartitionFilter } from './filters/partition-filter';
import { SpecFilter } from './filters/spec-filter';
import { X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from 'next/navigation';

interface RankFiltersProps {
  raidSlug: string;
}

export function RankFilters({ raidSlug }: RankFiltersProps) {
  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClearFilters = () => {
    const newSearchParams = new URLSearchParams();
    const currentPage = searchParams.get('page');
    if (currentPage) {
      newSearchParams.set('page', currentPage);
    }
    router.push(pathName + '?' + newSearchParams.toString());
  };

  return (
    <div className="flex flex-row gap-2 overflow-auto">
      <PartitionFilter raidSlug={raidSlug} />
      <ClassFilter />
      <SpecFilter />
      <Button
        variant="outline"
        className="ml-auto text-xs"
        onClick={handleClearFilters}
      >
        <span className="sr-only">Limpar filtros</span>
        Limpar
        <X className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}
