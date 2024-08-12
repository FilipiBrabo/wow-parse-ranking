'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@parse-ranking/shadcn-ui';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { RouterOutput } from '../../../../../src/server';

export type Partition = RouterOutput['raids']['listPartitions'][0];

interface PartitionFilterProps {
  partitions: Partition[];
}

export function PartitionFilter({ partitions }: PartitionFilterProps) {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();

  const selectedPartition = searchParams.get('partition');

  const handleSelectPartition = (partition?: string) => {
    if (!partition) return;

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('page');
    newSearchParams.set('partition', partition);

    router.push(pathName + '?' + newSearchParams.toString());
  };

  if (!partitions?.length || partitions.length === 1) {
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
        // Workaround to stop touch event leaking to underneath elements
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
