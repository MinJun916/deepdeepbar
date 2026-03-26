'use server';

import { revalidatePath } from 'next/cache';

import { createSupabaseAdminClient } from '@/lib/supabase/admin';

const menuTable = process.env.NEXT_PUBLIC_SUPABASE_COCKTAILS_TABLE ?? 'Menu';

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

const parsePrice = (raw: FormDataEntryValue | null) => {
  const parsed = Number.parseInt(String(raw ?? '0'), 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const createMenuAction = async (formData: FormData) => {
  const supabase = createSupabaseAdminClient();

  const payload = {
    category: String(formData.get('category')),
    name: String(formData.get('name')).trim(),
    name_en: String(formData.get('name_en')).trim(),
    description: String(formData.get('description')).trim(),
    price: parsePrice(formData.get('price')),
    abv: parseAbv(formData.get('abv')),
    taste_note: String(formData.get('taste_note')).trim(),
    tags: parseTags(formData.get('tags')),
    is_signature: formData.get('is_signature') === 'on',
  };

  const { error } = await supabase.schema('public').from(menuTable).insert(payload);
  if (error) {
    throw new Error(`Menu insert failed: ${error.message}`);
  }

  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/add');
  revalidatePath('/admin/manage');
};

export const updateMenuAction = async (formData: FormData) => {
  const supabase = createSupabaseAdminClient();
  const id = String(formData.get('id'));

  const payload = {
    category: String(formData.get('category')),
    name: String(formData.get('name')).trim(),
    name_en: String(formData.get('name_en')).trim(),
    description: String(formData.get('description')).trim(),
    price: parsePrice(formData.get('price')),
    abv: parseAbv(formData.get('abv')),
    taste_note: String(formData.get('taste_note')).trim(),
    tags: parseTags(formData.get('tags')),
    is_signature: formData.get('is_signature') === 'on',
  };

  const { error } = await supabase.schema('public').from(menuTable).update(payload).eq('id', id);
  if (error) {
    throw new Error(`Menu update failed: ${error.message}`);
  }

  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/add');
  revalidatePath('/admin/manage');
};

export const deleteMenuAction = async (formData: FormData) => {
  const supabase = createSupabaseAdminClient();
  const id = String(formData.get('id'));

  const { error } = await supabase.schema('public').from(menuTable).delete().eq('id', id);
  if (error) {
    throw new Error(`Menu delete failed: ${error.message}`);
  }

  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/add');
  revalidatePath('/admin/manage');
};
