'use client';

import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { WOW_CLASSES } from '../../../../../app/constants';
import { querifyString } from '../../../../../src/utils/querify-string';
import { TableFilter } from './table-filter';

export function ClassFilter() {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();

  const selectedClass = searchParams.get('class');

  const handleSelectClass = (className?: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('page');
    newSearchParams.delete('spec');
    newSearchParams.delete('class');

    if (className) {
      newSearchParams.set('class', className);
    }

    router.push(pathName + '?' + newSearchParams.toString());
  };

  return (
    <TableFilter
      name="Classe"
      options={WOW_CLASSES.map((wowClass) => {
        const label = (
          <div className="flex items-center gap-2">
            <div className="relative w-4 h-4">
              <Image
                fill
                sizes="16px"
                quality={100}
                src={wowClass.icon}
                alt={`Ícone da classe ${wowClass.name}`}
                loading="eager"
                className="object-contain"
              />
            </div>
            {wowClass.name}
          </div>
        );

        return {
          value: querifyString(wowClass.name),
          label,
        };
      })}
      value={selectedClass ?? ''}
      onChange={handleSelectClass}
    />
  );
}
