import 'client-only';

import {
  Button,
  cn,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@parse-ranking/shadcn-ui';
import { Check, ChevronDownIcon } from 'lucide-react';
import * as React from 'react';

interface TableFilterProps {
  name: string;
  options: {
    value: string;
    label: React.ReactNode;
  }[];
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export function TableFilter({
  name,
  options,
  value,
  onChange,
  disabled,
}: TableFilterProps) {
  const [open, setOpen] = React.useState(false);
  const [innerValue, setInnerValue] = React.useState(value);

  const handleChange = (value: string) => {
    setInnerValue(value === innerValue ? '' : value);

    setOpen(false);
    onChange(value);
  };

  const selectedOption = options.find((option) => option.value === innerValue);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-fit justify-between gap-2 text-xs"
          disabled={disabled}
        >
          <span className="font-semibold">{name}</span>

          {selectedOption && (
            <>
              <div className="bg-border w-px h-4" />
              {selectedOption.label}
            </>
          )}
          <ChevronDownIcon className="w-4 h-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0">
        <Command>
          <CommandInput placeholder={name} className="h-9" />

          <CommandList>
            <div className="max-h-[244px] overflow-auto">
              <CommandEmpty className="p-2 text-sm text-center">
                Nenhum resultado encontrado.
              </CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={handleChange}
                    className="transition-all"
                  >
                    {option.label}
                    <Check
                      className={cn(
                        'ml-auto',
                        innerValue === option.value
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => handleChange('')}
                className="justify-center transition-all"
              >
                Limpar
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
