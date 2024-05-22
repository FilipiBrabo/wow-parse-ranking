import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@parse-ranking/shadcn-ui';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export type Partition = {
  label: string;
  value: number;
};

type PartitionFilterProps = {
  partitions: Partition[];
};

export function PartitionFilter({ partitions }: PartitionFilterProps) {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();

  const selectedPartition =
    searchParams.get('partition') ??
    String(Math.max(...partitions.map((p) => p.value)));

  const handleSelectPartition = (partition?: string) => {
    if (!partition) return;

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('page');
    newSearchParams.set('partition', partition);

    router.push(pathName + '?' + newSearchParams.toString());
  };

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
        {partitions.map((partition) => (
          <SelectItem key={partition.value} value={String(partition.value)}>
            {partition.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
