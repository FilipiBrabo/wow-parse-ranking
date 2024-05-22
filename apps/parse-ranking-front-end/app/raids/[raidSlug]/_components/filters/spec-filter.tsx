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
    if (!spec) return;
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('page');
    newSearchParams.set('spec', spec);

    router.push(pathName + '?' + newSearchParams.toString());
  };

  return (
    <Select
      onValueChange={handleSelectSpec}
      value={selectedSpec ?? ''}
      disabled={!availableSpecs?.length}
    >
      <SelectTrigger disabled={!availableSpecs?.length}>
        <SelectValue placeholder="Spec" />
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
        {availableSpecs?.map((spec) => (
          <SelectItem key={spec.name} value={querifyString(spec.name)}>
            <div className="flex items-center gap-2">
              <Image
                width={16}
                height={16}
                quality={100}
                src={spec.icon}
                alt={`Ícone da spec ${spec.name}`}
              />
              {spec.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
