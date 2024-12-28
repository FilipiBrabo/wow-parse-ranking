'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@parse-ranking/shadcn-ui';
import { Loader2Icon } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { RouterOutput } from '../../../../../src/server';
import { trpc } from '../../../../_trpc/client';

export type Partition = RouterOutput['raids']['listPartitions'][0];

interface PartitionFilterProps {
  raidSlug: string;
}

export function PartitionFilter({ raidSlug }: PartitionFilterProps) {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();

  // TODO: we could start this fetch on the server with PPR
  const { data, isInitialLoading } = trpc.raids.listPartitions.useQuery({
    raidSlug,
  });

  const selectedPartition = searchParams.get('partition');

  const handleSelectPartition = (partition?: string) => {
    if (!partition) return;

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('page');
    newSearchParams.set('partition', partition);

    router.push(pathName + '?' + newSearchParams.toString());
  };

  const selectValue = selectedPartition && data ? selectedPartition : undefined;

  return (
    <Select onValueChange={handleSelectPartition} value={selectValue}>
      <SelectTrigger>
        <SelectValue placeholder="Partição" />
      </SelectTrigger>
      <SelectContent
        // Workaround to stop touch event leaking to underneath elements
        // https://github.com/radix-ui/primitives/issues/1658#issuecomment-1664079551
        ref={(ref) => {
          if (!ref) return;
          ref.ontouchstart = (e) => {
            e.preventDefault();
          };
        }}
      >
        {isInitialLoading || !data ? (
          <div className="p-2 text-sm flex items-center">
            <Loader2Icon className="animate-spin mr-1 w-4 h-4" />
            Carregando...
          </div>
        ) : (
          data.map((partition) => (
            <SelectItem key={partition.wclId} value={String(partition.wclId)}>
              {partition.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
