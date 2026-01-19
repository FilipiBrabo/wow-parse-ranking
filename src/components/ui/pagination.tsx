import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button, ButtonProps, buttonVariants } from './button';

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('flex justify-center', className)}
    {...props}
  />
);
Pagination.displayName = 'Pagination';

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
));
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
));
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<typeof Link>;

const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) => (
  <Link
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? 'outline' : 'ghost',
        size,
      }),
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { isDisabled?: boolean }) => {
  const { isDisabled, ...rest } = props;
  if (isDisabled) {
    return (
      <Button size="icon" variant="ghost" disabled aria-disabled>
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="icon"
      className={className}
      {...rest}
    >
      <ChevronLeftIcon className="h-4 w-4" />
      <span className="sr-only">Previous</span>
    </PaginationLink>
  );
};
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { isDisabled?: boolean }) => {
  const { isDisabled, ...rest } = props;
  if (isDisabled) {
    return (
      <Button size="icon" variant="ghost" disabled aria-disabled>
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <PaginationLink
      aria-label="Go to next page"
      size="icon"
      className={className}
      {...rest}
    >
      <span className="sr-only">Próxima</span>
      <ChevronRightIcon className="h-4 w-4" />
    </PaginationLink>
  );
};
PaginationNext.displayName = 'PaginationNext';

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
};
