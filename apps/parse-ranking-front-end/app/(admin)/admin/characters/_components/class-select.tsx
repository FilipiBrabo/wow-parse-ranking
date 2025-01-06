import {
  Button,
  cn,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@parse-ranking/shadcn-ui';
import { useForm, useFormContext } from 'react-hook-form';
import { z } from 'zod';

import { Character } from './characters-table-columns';
import { trpc } from 'apps/parse-ranking-front-end/app/_trpc/client';
import { useState } from 'react';
import { CheckIcon, ChevronsUpDown } from 'lucide-react';
import { Portal } from '@radix-ui/react-dialog';
import { WOW_CLASSES } from 'apps/parse-ranking-front-end/app/constants';
import Image from 'next/image';
import { CharacterFormData } from './character-form';

export function ClassSelect({
  value,
  onChange,
}: {
  value: CharacterFormData['class'] | null;
  onChange: (value: CharacterFormData['class'] | null) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            {value ? (
              <div className="flex items-center gap-2">
                <div className="relative w-4 h-4">
                  <Image
                    fill
                    sizes="16px"
                    quality={100}
                    src={
                      WOW_CLASSES.find((wowClass) => wowClass.id === value)
                        ?.icon ?? ''
                    }
                    alt={`Ícone da classe ${value}`}
                    loading="eager"
                    className="object-contain"
                  />
                </div>
                {value}
              </div>
            ) : (
              'Selecione uma classe...'
            )}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 max-h-[284px] overflow-y-auto">
        <Command>
          <CommandInput
            placeholder="Pesquise por uma classe..."
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>Nenhuma classe encontrada.</CommandEmpty>
            <CommandGroup>
              {WOW_CLASSES.map((wowClass) => (
                <CommandItem
                  key={wowClass.id}
                  value={wowClass.id}
                  onSelect={() => {
                    onChange(wowClass.id);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="relative w-4 h-4">
                      <Image
                        fill
                        sizes="16px"
                        quality={100}
                        src={wowClass.icon}
                        alt={`Ícone da classe ${wowClass.label}`}
                        loading="eager"
                        className="object-contain"
                      />
                    </div>
                    {wowClass.label}
                  </div>
                  <CheckIcon
                    className={cn(
                      'ml-auto',
                      value === wowClass.label ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
