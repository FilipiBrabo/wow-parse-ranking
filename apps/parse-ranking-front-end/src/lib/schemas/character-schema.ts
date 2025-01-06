import { WOW_CLASSES } from 'apps/parse-ranking-front-end/app/constants';
import { z } from 'zod';

const classes = WOW_CLASSES.map((wowClass) => wowClass.id);

function zodEnum<T>(arr: T[]): [T, ...T[]] {
  return arr as [T, ...T[]];
}

export const characterSchema = z.object({
  name: z.string().min(1, { message: 'Este campo é obrigatório' }),
  guildId: z.number().nullable(),
  class: z.enum(zodEnum(classes), {
    errorMap: (error, ctx) => {
      if (error.code === 'invalid_enum_value') {
        return { message: 'Escolha uma classe' };
      }
      return { message: ctx.defaultError };
    },
  }),
  wclId: z.number().positive().nullable(),
  serverRegion: z.enum(['us', 'eu']),
  serverSlug: z.string().min(1, { message: 'Este campo é obrigatório' }),
  isBrazilian: z.boolean(),
});
