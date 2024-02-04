import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@parse-ranking/shadcn-ui';
import { usePathname } from 'next/navigation';

import { useCreateQueryString } from '../../../src/hooks/useCreateQueryString';

export type PaginationMenuProps = {
  total: number;
  offset: number;
  limit: number;
};

export function PaginationMenu({ total, offset, limit }: PaginationMenuProps) {
  const pathname = usePathname();
  const createQueryString = useCreateQueryString();

  const currentPage = Math.floor(offset / limit) + 1;
  const pageCount = Math.ceil(total / limit) || 1;

  const previousPage = Math.max(currentPage - 1, 1);
  const nextPage = Math.min(currentPage + 1, pageCount);

  const hasNextPage = nextPage !== currentPage;
  const hasPreviousPage = previousPage !== currentPage;

  return (
    <div className="flex items-center justify-between px-2 py-2 gap-2">
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
                isDisabled={!hasPreviousPage}
                href={
                  pathname +
                  '?' +
                  createQueryString('page', String(previousPage), {
                    keepPreviousParams: true,
                  })
                }
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                isDisabled={!hasNextPage}
                href={
                  pathname +
                  '?' +
                  createQueryString('page', String(nextPage), {
                    keepPreviousParams: true,
                  })
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
