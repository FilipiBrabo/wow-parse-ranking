import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@parse-ranking/shadcn-ui';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useCreateQueryString } from '../../../../src/hooks/useCreateQueryString';
import { WOW_CLASSES } from '../../../constants';

export function ClassFilter() {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();
  const createQueryString = useCreateQueryString();

  const selectedClass = searchParams.get('class');

  const handleSelectClass = (className?: string) => {
    if (!className) return;
    router.push(pathName + '?' + createQueryString('class', className));
  };

  return (
    <Select onValueChange={handleSelectClass} value={selectedClass ?? ''}>
      <SelectTrigger className="min-w-[160px]">
        <SelectValue placeholder="Selecione uma classe..." />
      </SelectTrigger>
      <SelectContent>
        {WOW_CLASSES.map((wowClass) => (
          <SelectItem
            key={wowClass.name}
            value={parseClassNameToQueryString(wowClass.name)}
          >
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

function parseClassNameToQueryString(className: string) {
  return className.toLowerCase().split(' ').join('');
}
