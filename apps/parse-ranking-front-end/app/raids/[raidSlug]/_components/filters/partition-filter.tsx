'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@parse-ranking/shadcn-ui';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';

import { trpc } from '../../../../_trpc/client';

export function PartitionFilter() {
  const params = useParams<{ raidSlug: string }>();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();

  const { data: partitions } = trpc.raids.listPartitions.useQuery({
    raidSlug: params.raidSlug,
  });

  const selectedPartition =
    searchParams.get('partition') ??
    partitions?.find((p) => p.isCurrent)?.wclId.toString();

  console.log({ selectedPartition, partitions });

  const handleSelectPartition = (partition?: string) => {
    if (!partition) return;

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('page');
    newSearchParams.set('partition', partition);

    router.push(pathName + '?' + newSearchParams.toString());
  };

  if (!partitions?.length) {
    return null;
  }

  return (
    <Select
      onValueChange={handleSelectPartition}
      value={selectedPartition ?? ''}
    >
      <SelectTrigger>
        <SelectValue placeholder="Partição" />
      </SelectTrigger>
      <SelectContent
        // Workaround to stop touch event to leak to underneath elements
        // https://github.com/radix-ui/primitives/issues/1658#issuecomment-1664079551
        ref={(ref) => {
          if (!ref) return;
          ref.ontouchstart = (e) => {
            e.preventDefault();
          };
        }}
      >
        {partitions?.map((partition) => (
          <SelectItem key={partition.wclId} value={String(partition.wclId)}>
            {partition.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
