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
import { TableFilter } from './table-filter';

export function SpecFilter() {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();

  const selectedClass = searchParams.get('class');

  const availableSpecs =
    WOW_CLASSES.find((c) => querifyString(c.name) === selectedClass)?.specs ??
    [];

  const selectedSpec =
    availableSpecs.length === 1
      ? querifyString(availableSpecs[0]?.name ?? '')
      : searchParams.get('spec');

  const handleSelectSpec = (spec?: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('page');
    newSearchParams.delete('spec');

    if (spec) {
      newSearchParams.set('spec', spec);
    }

    router.push(pathName + '?' + newSearchParams.toString());
  };

  return (
    <TableFilter
      name="Spec"
      options={availableSpecs.map((spec) => {
        const label = (
          <div className="flex items-center gap-2">
            <div className="relative w-4 h-4">
              <Image
                fill
                sizes="16px"
                quality={100}
                src={spec.icon}
                alt={`Ícone da spec ${spec.name}`}
                loading="eager"
                className="object-contain"
              />
            </div>
            {spec.name}
          </div>
        );

        return {
          value: querifyString(spec.name),
          label,
        };
      })}
      value={selectedSpec ?? ''}
      onChange={handleSelectSpec}
      disabled={!availableSpecs.length}
    />
  );
}
