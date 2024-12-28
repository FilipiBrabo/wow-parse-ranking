'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@parse-ranking/shadcn-ui';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { WOW_CLASSES } from '../../../../../app/constants';
import { querifyString } from '../../../../../src/utils/querify-string';

export function ClassFilter() {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();

  const selectedClass = searchParams.get('class');

  const handleSelectClass = (className?: string) => {
    if (!className) return;

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('page');
    newSearchParams.delete('spec');
    newSearchParams.set('class', className);

    router.push(pathName + '?' + newSearchParams.toString());
  };

  return (
    <Select onValueChange={handleSelectClass} value={selectedClass ?? ''}>
      <SelectTrigger>
        <SelectValue placeholder="Classe" />
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
        {WOW_CLASSES.map((wowClass) => (
          <SelectItem key={wowClass.name} value={querifyString(wowClass.name)}>
            <div className="flex items-center gap-2">
              <Image
                width={16}
                height={16}
                quality={100}
                src={wowClass.icon}
                alt={`Ícone da classe ${wowClass.name}`}
              />
              {wowClass.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
