import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@parse-ranking/shadcn-ui';
import { useCreateQueryString } from 'apps/parse-ranking-front-end/src/hooks/useCreateQueryString';
import { ChevronDownIcon, FilterX, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

const CLASSES = [
  {
    name: 'Mage',
    icon: '',
  },
  {
    name: 'Warrior',
    icon: '',
  },
  {
    name: 'Priest',
    icon: '',
  },
  {
    name: 'Rogue',
    icon: '',
  },
];

export function RankFilters() {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const createQueryString = useCreateQueryString();

  const currentPage = searchParams.get('page') ?? 0;
  const selectedClass = searchParams.get('class');

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="w-6 h-6" />
        <DropdownMenu>
          <DropdownMenuTrigger
            onChange={(data) => console.log({ data })}
            asChild
          >
            <Button variant="outline" className="flex items-center gap-1">
              {selectedClass ? selectedClass : 'Classe'}
              <ChevronDownIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link href={pathName}>Todas</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {CLASSES.map((wowClass) => (
              <DropdownMenuItem key={wowClass.name} asChild>
                <Link
                  href={
                    pathName + '?' + createQueryString('class', wowClass.name)
                  }
                >
                  {wowClass.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
          Limpar filtros
        </Link>
      </Button>
    </div>
  );
}
