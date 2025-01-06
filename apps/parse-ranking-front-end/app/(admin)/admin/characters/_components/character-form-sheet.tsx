'use client';

import { Button, Input, SheetClose } from '@parse-ranking/shadcn-ui';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@parse-ranking/shadcn-ui';
import { DialogProps } from '@radix-ui/react-dialog';
import { useState } from 'react';
import { Character } from './characters-table-columns';
import { CharacterForm, CharacterFormData } from './character-form';
import { toast } from 'sonner';
import { trpc } from 'apps/parse-ranking-front-end/app/_trpc/client';
import { useRouter } from 'next/navigation';

export const useCharacterFormSheet = () => {
  const [open, setOpen] = useState(false);
  const [character, setCharacter] = useState<Character | null>(null);

  const sheet = (
    <CharacterSheet open={open} onOpenChange={setOpen} character={character} />
  );

  const handleOpen = (character?: Character) => {
    setCharacter(character ?? null);
    setOpen(true);
  };

  return { sheet, openSheet: handleOpen };
};

function CharacterSheet({
  open,
  onOpenChange,
  character,
}: DialogProps & { character?: Character | null }) {
  const router = useRouter();
  const isEditing = !!character;

  const { mutate: updateCharacter } = trpc.characters.update.useMutation({
    onSuccess: () => {
      toast.success('Personagem atualizado com sucesso');
      router.refresh();
    },
    onError: () => {
      toast.error('Erro ao atualizar personagem');
    },
  });

  const { mutate: createCharacter } = trpc.characters.create.useMutation({
    onSuccess: () => {
      toast.success('Personagem criado com sucesso');
      router.refresh();
    },
    onError: () => {
      toast.error('Erro ao criar personagem');
    },
  });

  const handleSubmit = (values: CharacterFormData) => {
    if (isEditing) {
      updateCharacter({
        id: character.id,
        data: values,
      });
    } else {
      createCharacter({ data: values });
    }

    onOpenChange?.(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>{isEditing ? 'Editar' : 'Criar'} personagem</SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Edite as informações do personagem'
              : 'Crie um novo personagem'}
          </SheetDescription>
        </SheetHeader>

        <CharacterForm defaultValues={character} onSubmit={handleSubmit} />
      </SheetContent>
    </Sheet>
  );
}
