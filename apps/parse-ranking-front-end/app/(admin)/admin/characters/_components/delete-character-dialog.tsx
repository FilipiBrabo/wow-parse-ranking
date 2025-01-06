'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@parse-ranking/shadcn-ui';
import { AlertDialogProps } from '@radix-ui/react-alert-dialog';
import { trpc } from 'apps/parse-ranking-front-end/app/_trpc/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export const useDeleteCharacterDialog = () => {
  const [open, setOpen] = useState(false);
  const [characterId, setCharacterId] = useState<number | null>(null);

  const dialog = characterId ? (
    <DeleteCharacterDialog
      open={open}
      onOpenChange={setOpen}
      characterId={characterId}
    />
  ) : null;

  const handleOpen = (characterId: number) => {
    setCharacterId(characterId);
    setOpen(true);
  };

  return { dialog, openDialog: handleOpen };
};

function DeleteCharacterDialog({
  characterId,
  ...rest
}: AlertDialogProps & { characterId: number }) {
  const router = useRouter();

  // TODO: we could use server actions to delete the character
  const { mutate, isLoading } = trpc.characters.delete.useMutation({
    onSuccess: () => {
      toast.success('Personagem excluído com sucesso');
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <AlertDialog {...rest}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso irá excluir permanentemente o
            personagem e todos os dados relacionados a ele.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isLoading}
            onClick={() => mutate({ id: characterId })}
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
