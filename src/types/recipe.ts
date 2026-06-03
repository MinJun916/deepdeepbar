type MenuForRecipe = {
  id: string;
  name: string;
  name_en: string;
};

type GlassTypeCode =
  | 'double_shot_glass'
  | 'highball_glass'
  | 'hurricane_glass'
  | 'long_drink_glass'
  | 'margarita_glass'
  | 'martini_glass'
  | 'old_fashioned_glass'
  | 'rocks_glass'
  | 'shot_glass';

type GlassType = {
  id: string;
  code: GlassTypeCode;
  name_ko: string;
  name_en: string;
  description: string;
};

type Step = {
  id: string;
  recipe_id: string;
  step_order: number;
  instruction: string;
};

export type RecipeResponse = {
  id: string;
  menu_id: string;
  glass_type_id: string;
  garnish: string;
  mixing_method: string;
  notes: string;
  menu: MenuForRecipe;
  glass_type: GlassType;
  steps: Step[];
};