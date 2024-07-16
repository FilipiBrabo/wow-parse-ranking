import { Skeleton } from '@parse-ranking/shadcn-ui';

export function FiltersSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-10" />
      <Skeleton className="h-10" />
      <Skeleton className="h-10 md:hidden" />
    </div>
  );
}
