'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { RouterOutput } from '../../../../../src/server';
import { trpc } from '../../../../_trpc/client';
import { TableFilter } from './table-filter';

export type Partition = RouterOutput['raids']['listPartitions'][0];

interface PartitionFilterProps {
  raidSlug: string;
}

export function PartitionFilter({ raidSlug }: PartitionFilterProps) {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();

  const { data } = trpc.raids.listPartitions.useQuery({
    raidSlug,
  });

  const selectedPartition = searchParams.get('partition');

  const handleSelectPartition = (partition?: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('page');
    newSearchParams.delete('partition');

    if (partition) {
      newSearchParams.set('partition', partition);
    }

    router.push(pathName + '?' + newSearchParams.toString());
  };

  const selectValue = selectedPartition && data ? selectedPartition : undefined;

  return (
    <TableFilter
      name="Partição"
      options={
        data
          ? data.map((partition) => ({
              value: String(partition.wclId),
              label: partition.name,
            }))
          : [{ value: 'loading', label: 'Carregando...' }]
      }
      value={selectValue ?? ''}
      onChange={handleSelectPartition}
    />
  );
}
