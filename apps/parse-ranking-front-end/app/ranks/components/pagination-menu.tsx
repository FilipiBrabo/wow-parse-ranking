import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@parse-ranking/shadcn-ui';
import { usePathname } from 'next/navigation';

import { createQueryString } from '../../../src/utils/createQueryString';

export type PaginationMenuProps = {
  total: number;
  offset: number;
  limit: number;
};

export function PaginationMenu({ total, offset, limit }: PaginationMenuProps) {
  const pathname = usePathname();

  const currentPage = Math.floor(offset / limit) + 1;
  const pageCount = Math.ceil(total / limit) || 1;

  const previousPage = Math.max(currentPage - 1, 1);
  const nextPage = Math.min(currentPage + 1, pageCount);

  return (
    <div className="flex items-center justify-between px-2">
      <span className="text-sm text-muted-foreground">
        {total} personagens encontrados
      </span>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Página {currentPage} de {pageCount}
        </span>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={
                  pathname +
                  '?' +
                  createQueryString('page', String(previousPage))
                }
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href={
                  pathname + '?' + createQueryString('page', String(nextPage))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
