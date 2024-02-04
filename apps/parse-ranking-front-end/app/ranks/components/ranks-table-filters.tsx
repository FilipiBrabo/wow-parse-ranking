import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@parse-ranking/shadcn-ui';
import { ChevronDownIcon, FilterX, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import { useCreateQueryString } from '../../../src/hooks/useCreateQueryString';
import { WOW_CLASSES } from '../../constants';
import { beautifyClassName } from '../utils/beautify-class-name';

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
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              {selectedClass ? beautifyClassName(selectedClass) : 'Classe'}
              <ChevronDownIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link href={pathName}>Todas</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {WOW_CLASSES.map((wowClass) => (
              <DropdownMenuItem key={wowClass.name} asChild>
                <Link
                  href={
                    pathName +
                    '?' +
                    createQueryString(
                      'class',
                      parseClassNameToQueryString(wowClass.name)
                    )
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

function parseClassNameToQueryString(className: string) {
  return className.toLowerCase().split(' ').join('');
}
