import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  RadioGroup,
  RadioGroupItem,
  Switch,
} from '@parse-ranking/shadcn-ui';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Character } from './characters-table-columns';
import { GuildSelect } from './guild-select';
import { characterSchema } from 'apps/parse-ranking-front-end/src/lib/schemas/character-schema';
import { ClassSelect } from './class-select';

export type CharacterFormData = z.infer<typeof characterSchema>;

export function CharacterForm({
  defaultValues,
  onSubmit,
}: {
  defaultValues?: Partial<Character> | null;
  onSubmit: (values: CharacterFormData) => void;
}) {
  console.log({ defaultValues });
  const form = useForm<CharacterFormData>({
    resolver: zodResolver(characterSchema),
    defaultValues: {
      name: '',
      serverRegion: 'us' as any,
      serverSlug: '',
      class: '' as any,
      isBrazilian: true,
      isActive: true,
      guildId: null,
      wclId: null,
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate={true}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem required={true}>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="wclId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Warcraft Logs ID</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) =>
                    form.setValue('wclId', +e.target.value, {
                      shouldValidate: true,
                    })
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="guildId"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel>Guild</FormLabel>
              <GuildSelect
                value={field.value}
                onChange={(value) => {
                  form.setValue('guildId', value, { shouldValidate: true });
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="class"
          render={({ field }) => (
            <FormItem required={true}>
              <FormLabel>Classe</FormLabel>
              <ClassSelect
                value={field.value}
                onChange={(value) => {
                  if (!value) return;
                  form.setValue('class', value, { shouldValidate: true });
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="serverRegion"
            render={({ field }) => (
              <FormItem
                required={true}
                className="space-y-3 flex-shrink-0 flex-1"
              >
                <FormLabel>Região</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-1"
                  >
                    <FormItem className="flex items-center space-x-1 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="us" />
                      </FormControl>
                      <FormLabel className="font-normal">US</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-1 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="eu" />
                      </FormControl>
                      <FormLabel className="font-normal">EU</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serverSlug"
            render={({ field }) => (
              <FormItem required={true} className="flex-shrink-0 flex-1">
                <FormLabel>Realm</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value.toLowerCase() ?? ''}
                    onChange={(e) =>
                      form.setValue(
                        'serverSlug',
                        e.target.value.toLowerCase(),
                        { shouldValidate: true }
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isBrazilian"
          render={({ field }) => (
            <FormItem
              required={true}
              className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"
            >
              <div className="space-y-0.5 mr-1">
                <FormLabel>Brasileiro</FormLabel>
                <FormDescription>
                  Jogadores que não são brasileiros são ignorados no ranking.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Form>
  );
}
