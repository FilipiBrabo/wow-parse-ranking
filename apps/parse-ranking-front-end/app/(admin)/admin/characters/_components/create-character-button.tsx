'use client';

import { Button } from '@parse-ranking/shadcn-ui';
import { useCharacterFormSheet } from './character-form-sheet';
import { PlusIcon } from 'lucide-react';

export function CreateCharacterButton() {
  const { sheet, openSheet } = useCharacterFormSheet();

  return (
    <>
      {sheet}
      <Button onClick={() => openSheet()}>
        <PlusIcon className="w-4 h-4" />
        <p className="hidden md:block ml-2">Criar personagem</p>
      </Button>
    </>
  );
}
