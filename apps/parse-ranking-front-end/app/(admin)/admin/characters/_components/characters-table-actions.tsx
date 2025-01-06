import { Button } from '@parse-ranking/shadcn-ui';
import { Row } from '@tanstack/react-table';
import { PencilIcon, TrashIcon } from 'lucide-react';

import { useCharacterFormSheet } from './character-form-sheet';
import { Character } from './characters-table-columns';
import { useDeleteCharacterDialog } from './delete-character-dialog';

// TODO: add action to update the character rank

export function CharactersTableActions({ row }: { row: Row<Character> }) {
  const { dialog, openDialog } = useDeleteCharacterDialog();
  const { sheet, openSheet } = useCharacterFormSheet();

  return (
    <div className="flex items-center gap-2">
      {dialog}
      {sheet}
      <Button
        size="icon"
        variant="outline"
        onClick={() => openSheet(row.original)}
      >
        <PencilIcon className="w-4 h-4" />
      </Button>
      <Button
        size="icon"
        variant="destructive"
        onClick={() => openDialog(row.original.id)}
      >
        <TrashIcon className="w-4 h-4" />
      </Button>
    </div>
  );
}
