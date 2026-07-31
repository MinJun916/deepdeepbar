import { z } from 'zod';

import type { GlassTypeCode } from '@/types/recipe';

export const glassTypeOptions: Array<{ value: GlassTypeCode; label: string }> = [
  { value: 'shot_glass', label: '샷 글라스' },
  { value: 'double_shot_glass', label: '더블 샷 글라스' },
  { value: 'rocks_glass', label: '록스 글라스' },
  { value: 'old_fashioned_glass', label: '올드 패션드 글라스' },
  { value: 'highball_glass', label: '하이볼 글라스' },
  { value: 'long_drink_glass', label: '롱드링크 글라스' },
  { value: 'martini_glass', label: '마티니 글라스' },
  { value: 'margarita_glass', label: '마가리타 글라스' },
  { value: 'hurricane_glass', label: '허리케인 글라스' },
];

const glassTypeSchema = z.enum([
  'double_shot_glass',
  'highball_glass',
  'hurricane_glass',
  'long_drink_glass',
  'margarita_glass',
  'martini_glass',
  'old_fashioned_glass',
  'rocks_glass',
  'shot_glass',
]);

const recipeStepSchema = z.object({
  step_order: z.number().int().min(1),
  instruction: z.string().trim().min(1, '제조 단계를 입력해 주세요.'),
});

export const createRecipeFormSchema = z.object({
  menu_id: z.string().min(1, '메뉴를 선택해 주세요.'),
  glass_type: glassTypeSchema,
  garnish: z.string(),
  mixing_method: z.string().trim().min(1, '제조 방식을 입력해 주세요.'),
  notes: z.string(),
  steps: z.array(recipeStepSchema).min(1, '제조 단계를 1개 이상 추가해 주세요.'),
});

export type CreateRecipeFormValues = z.infer<typeof createRecipeFormSchema>;

export const updateRecipeFormSchema = createRecipeFormSchema.omit({ menu_id: true });

export type UpdateRecipeFormValues = z.infer<typeof updateRecipeFormSchema>;
