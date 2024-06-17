'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@parse-ranking/shadcn-ui';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { startCase } from 'lodash';

import { CharacterLink } from '../../../../src/components/character-link';
import { GuildLink } from '../../../../src/components/guild-link';
import { SpecIcon } from '../../../../src/components/SpecIcon';
import { RouterOutput } from '../../../../src/server';
import { getRankColor } from '../../../../src/utils/getRankColor';

type Character = RouterOutput['rank']['getRanks']['items'][number];

const columnHelper = createColumnHelper<Character>();

export const columns = [
  columnHelper.accessor('rank', {
    header: () => <span>Rank</span>,
    cell: ({ getValue }) => <span>{getValue()}</span>,
    maxSize: 100,
  }),
  columnHelper.accessor('spec', {
    header: () => <span>Spec</span>,
    cell: ({ getValue, row }) => {
      const spec = getValue();
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <SpecIcon spec={spec} wowClass={row.original.class} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <span>{startCase(`${getValue()} ${row.original.class}`)}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    maxSize: 100,
  }),
  columnHelper.accessor('name', {
    header: () => <span>Nome</span>,
    cell: ({ getValue, row }) => {
      const { realm, class: className, region } = row.original;
      return (
        <CharacterLink
          name={getValue()}
          realm={realm}
          class={className}
          region={region}
        />
      );
    },
  }),
  columnHelper.accessor('guildName', {
    header: () => <span>Guild</span>,
    cell: ({ getValue, row }) => {
      const guildName = getValue();
      const guildId = row.original.guildId;

      if (!guildName || !guildId) return 'Sem guild';
      return <GuildLink guildName={guildName} guildId={guildId} />;
    },
    minSize: 250,
  }),
  columnHelper.accessor('todayPercent', {
    header: () => <span>Today %</span>,
    cell: ({ getValue, row }) => {
      const todayPercent = getValue();
      const dateString = row.original.lastRankUpdate;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className={`text-${getRankColor(Number(todayPercent))}`}>
                {Number(todayPercent).toFixed(2)}
              </span>
            </TooltipTrigger>
            {dateString && (
              <TooltipContent>
                <span>
                  Atualizado em {new Date(dateString).toLocaleString('pt-BR')}
                </span>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      );
    },
  }),
] as ColumnDef<Character>[];
