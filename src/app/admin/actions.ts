'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ADMIN_SESSION_COOKIE_NAME, getAdminAuthConfig } from '@/lib/adminAuth';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

const menuTable =
  process.env.NEXT_PUBLIC_SUPABASE_MENUS_TABLE ??
  process.env.NEXT_PUBLIC_SUPABASE_COCKTAILS_TABLE ??
  'menus';
const menuPricesTable = process.env.NEXT_PUBLIC_SUPABASE_MENU_PRICES_TABLE ?? 'menu_prices';
const recipeTable = process.env.NEXT_PUBLIC_SUPABASE_RECIPES_TABLE ?? 'recipes';
const recipeStepsTable = process.env.NEXT_PUBLIC_SUPABASE_RECIPE_STEPS_TABLE ?? 'recipe_steps';

export const loginAdminAction = async (formData: FormData) => {
  const authConfig = getAdminAuthConfig();
  if (!authConfig) {
    redirect('/admin/login?error=config');
  }

  const username = String(formData.get('username') ?? '');
  const password = String(formData.get('password') ?? '');

  if (username !== authConfig.username || password !== authConfig.password) {
    redirect('/admin/login?error=invalid');
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, 'authenticated', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  });

  redirect('/admin');
};

export const logoutAdminAction = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE_NAME);
  redirect('/admin/login');
};

const parseTags = (raw: FormDataEntryValue | null) => {
  const value = String(raw ?? '').trim();
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item));
    }
  } catch {
    // Fallback to comma-separated tags when JSON parsing fails.
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const parseAbv = (raw: FormDataEntryValue | null) => {
  const value = String(raw ?? '').trim();
  if (!value) {
    return null;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const parseText = (raw: FormDataEntryValue | null) => String(raw ?? '').trim();
const parsePriceType = (value: string) => {
  if (value === 'default' || value === 'shot' || value === 'bottle') {
    return value;
  }

  return 'default';
};

const parseMenuPriceLines = (raw: FormDataEntryValue | null) =>
  parseText(raw)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [typeRaw, priceRaw] = line.split('|').map((part) => part.trim());
      const price = Number.parseInt(priceRaw ?? '', 10);
      if (!Number.isFinite(price)) {
        return null;
      }

      return {
        price_type: parsePriceType(typeRaw),
        price,
        display_order: index + 1,
        is_active: true,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

const parseStepLines = (raw: FormDataEntryValue | null) =>
  parseText(raw)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((instruction, index) => ({
      step_order: index + 1,
      instruction,
    }));

export const createMenuAction = async (formData: FormData) => {
  const supabase = createSupabaseAdminClient();
  const priceOptions = parseMenuPriceLines(formData.get('price_options'));

  const payload = {
    category: String(formData.get('category')),
    name: String(formData.get('name')).trim(),
    name_en: String(formData.get('name_en')).trim(),
    description: String(formData.get('description')).trim(),
    abv: parseAbv(formData.get('abv')),
    taste_note: String(formData.get('taste_note')).trim(),
    tags: parseTags(formData.get('tags')),
    is_signature: formData.get('is_signature') === 'on',
  };

  const { data: menuRow, error } = await supabase
    .schema('public')
    .from(menuTable)
    .insert(payload)
    .select('id')
    .single();
  if (error) {
    throw new Error(`Menu insert failed: ${error.message}`);
  }

  const menuId = menuRow.id as string;
  if (priceOptions.length > 0) {
    const pricesPayload = priceOptions.map((option) => ({
      menu_id: menuId,
      ...option,
    }));
    const { error: priceError } = await supabase
      .schema('public')
      .from(menuPricesTable)
      .insert(pricesPayload);
    if (priceError) {
      throw new Error(`Menu price insert failed: ${priceError.message}`);
    }
  }

  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/menu');
  revalidatePath('/admin/menu/add');
  revalidatePath('/admin/menu/manage');
};

export const createRecipeAction = async (formData: FormData) => {
  const supabase = createSupabaseAdminClient();
  const menuId = parseText(formData.get('menu_id'));
  const glassTypeId = parseText(formData.get('glass_type_id'));
  const steps = parseStepLines(formData.get('steps_input'));

  const payload = {
    menu_id: menuId,
    glass_type_id: glassTypeId || null,
    garnish: parseText(formData.get('garnish')),
    mixing_method: parseText(formData.get('mixing_method')),
    notes: parseText(formData.get('notes')),
  };

  const { data: recipeRow, error } = await supabase
    .schema('public')
    .from(recipeTable)
    .insert(payload)
    .select('id')
    .single();
  if (error) {
    throw new Error(`Recipe insert failed: ${error.message}`);
  }

  const recipeId = recipeRow.id as string;

  if (steps.length > 0) {
    const stepsPayload = steps.map((step) => ({
      recipe_id: recipeId,
      ...step,
    }));
    const { error: stepError } = await supabase
      .schema('public')
      .from(recipeStepsTable)
      .insert(stepsPayload);
    if (stepError) {
      throw new Error(`Recipe step insert failed: ${stepError.message}`);
    }
  }

  revalidatePath('/admin/recipe');
  revalidatePath('/admin/recipe/manage');
};

export const updateRecipeAction = async (formData: FormData) => {
  const supabase = createSupabaseAdminClient();
  const id = parseText(formData.get('id'));
  const menuId = parseText(formData.get('menu_id'));
  const glassTypeId = parseText(formData.get('glass_type_id'));
  const steps = parseStepLines(formData.get('steps_input'));

  const payload = {
    menu_id: menuId,
    glass_type_id: glassTypeId || null,
    garnish: parseText(formData.get('garnish')),
    mixing_method: parseText(formData.get('mixing_method')),
    notes: parseText(formData.get('notes')),
  };

  const { error } = await supabase.schema('public').from(recipeTable).update(payload).eq('id', id);
  if (error) {
    throw new Error(`Recipe update failed: ${error.message}`);
  }

  const { error: deleteStepsError } = await supabase
    .schema('public')
    .from(recipeStepsTable)
    .delete()
    .eq('recipe_id', id);
  if (deleteStepsError) {
    throw new Error(`Recipe step reset failed: ${deleteStepsError.message}`);
  }

  if (steps.length > 0) {
    const stepsPayload = steps.map((step) => ({
      recipe_id: id,
      ...step,
    }));
    const { error: stepError } = await supabase
      .schema('public')
      .from(recipeStepsTable)
      .insert(stepsPayload);
    if (stepError) {
      throw new Error(`Recipe step update failed: ${stepError.message}`);
    }
  }

  revalidatePath('/admin/recipe');
  revalidatePath('/admin/recipe/manage');
};

export const deleteRecipeAction = async (formData: FormData) => {
  const supabase = createSupabaseAdminClient();
  const id = parseText(formData.get('id'));

  const { error: stepsDeleteError } = await supabase
    .schema('public')
    .from(recipeStepsTable)
    .delete()
    .eq('recipe_id', id);
  if (stepsDeleteError) {
    throw new Error(`Recipe step delete failed: ${stepsDeleteError.message}`);
  }

  const { error } = await supabase.schema('public').from(recipeTable).delete().eq('id', id);
  if (error) {
    throw new Error(`Recipe delete failed: ${error.message}`);
  }

  revalidatePath('/admin/recipe');
  revalidatePath('/admin/recipe/manage');
};

export const updateMenuAction = async (formData: FormData) => {
  const supabase = createSupabaseAdminClient();
  const id = String(formData.get('id'));
  const priceOptions = parseMenuPriceLines(formData.get('price_options'));

  const payload = {
    category: String(formData.get('category')),
    name: String(formData.get('name')).trim(),
    name_en: String(formData.get('name_en')).trim(),
    description: String(formData.get('description')).trim(),
    abv: parseAbv(formData.get('abv')),
    taste_note: String(formData.get('taste_note')).trim(),
    tags: parseTags(formData.get('tags')),
    is_signature: formData.get('is_signature') === 'on',
  };

  const { error } = await supabase.schema('public').from(menuTable).update(payload).eq('id', id);
  if (error) {
    throw new Error(`Menu update failed: ${error.message}`);
  }

  const { error: deletePriceError } = await supabase
    .schema('public')
    .from(menuPricesTable)
    .delete()
    .eq('menu_id', id);
  if (deletePriceError) {
    throw new Error(`Menu price reset failed: ${deletePriceError.message}`);
  }

  if (priceOptions.length > 0) {
    const pricesPayload = priceOptions.map((option) => ({
      menu_id: id,
      ...option,
    }));
    const { error: priceError } = await supabase
      .schema('public')
      .from(menuPricesTable)
      .insert(pricesPayload);
    if (priceError) {
      throw new Error(`Menu price update failed: ${priceError.message}`);
    }
  }

  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/menu');
  revalidatePath('/admin/menu/add');
  revalidatePath('/admin/menu/manage');
};

export const deleteMenuAction = async (formData: FormData) => {
  const supabase = createSupabaseAdminClient();
  const id = String(formData.get('id'));

  const { error: deletePriceError } = await supabase
    .schema('public')
    .from(menuPricesTable)
    .delete()
    .eq('menu_id', id);
  if (deletePriceError) {
    throw new Error(`Menu price delete failed: ${deletePriceError.message}`);
  }

  const { error } = await supabase.schema('public').from(menuTable).delete().eq('id', id);
  if (error) {
    throw new Error(`Menu delete failed: ${error.message}`);
  }

  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/menu');
  revalidatePath('/admin/menu/add');
  revalidatePath('/admin/menu/manage');
};
