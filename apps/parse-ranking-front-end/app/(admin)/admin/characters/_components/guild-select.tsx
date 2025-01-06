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

export function GuildSelect({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const { data: guilds, isInitialLoading } = trpc.guilds.listAll.useQuery();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            {value
              ? guilds?.find((guild) => guild.id === value)?.name
              : 'Selecione uma guild...'}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 max-h-[284px] overflow-y-auto">
        <Command>
          <CommandInput
            placeholder="Pesquise por uma guild..."
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>Nenhuma guild encontrada.</CommandEmpty>
            <CommandGroup>
              {guilds?.map((guild) => (
                <CommandItem
                  key={guild.id}
                  value={guild.id.toString()}
                  onSelect={() => {
                    onChange(guild.id);
                    setOpen(false);
                  }}
                >
                  {guild.name}
                  <CheckIcon
                    className={cn(
                      'ml-auto',
                      value === guild.id ? 'opacity-100' : 'opacity-0'
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
