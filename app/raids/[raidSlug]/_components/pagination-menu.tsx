import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui';
import { usePathname, useSearchParams } from 'next/navigation';

export type PaginationMenuProps = {
  total: number;
  offset: number;
  limit: number;
};

export function PaginationMenu({ total, offset, limit }: PaginationMenuProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Math.floor(offset / limit) + 1;
  const pageCount = Math.ceil(total / limit) || 1;

  const previousPage = Math.max(currentPage - 1, 1);
  const nextPage = Math.min(currentPage + 1, pageCount);

  const hasNextPage = nextPage !== currentPage;
  const hasPreviousPage = previousPage !== currentPage;

  const getNextPageUrl = (newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('page', String(newPage));

    return pathname + '?' + newSearchParams.toString();
  };

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
                href={getNextPageUrl(previousPage)}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                isDisabled={!hasNextPage}
                href={getNextPageUrl(nextPage)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
