import { z } from 'zod';

const menuCategorySchema = z.enum([
  'cocktail',
  'whisky',
  'non-alcohol',
  'highball',
  'beer',
  'side',
]);

const menuPriceRequestSchema = z.object({
  price_type: z.string(),
  price: z.number().int().min(0),
  display_order: z.number().int().min(1),
  is_active: z.boolean().optional(),
});

export const createMenuFormSchema = z.object({
  category: menuCategorySchema,
  name: z.string().trim().min(1, '메뉴명을 입력해 주세요.'),
  name_en: z.string().trim().min(1, '영문명을 입력해 주세요.'),
  description: z.string().trim().min(1, '설명을 입력해 주세요.'),
  taste_note: z.string().trim().min(1, '테이스트 노트를 입력해 주세요.'),
  abv: z
    .union([z.nan(), z.number()])
    .transform((value) => (Number.isNaN(value) ? 0 : value))
    .pipe(z.number().min(0)),
  tags: z.array(z.string()),
  is_signature: z.boolean(),
  is_display: z.boolean(),
  prices: z.array(menuPriceRequestSchema),
});

export type CreateMenuFormValues = z.infer<typeof createMenuFormSchema>;

export const updateMenuFormSchema = createMenuFormSchema.extend({
  is_sold_out: z.boolean(),
});

export type UpdateMenuFormValues = z.infer<typeof updateMenuFormSchema>;
