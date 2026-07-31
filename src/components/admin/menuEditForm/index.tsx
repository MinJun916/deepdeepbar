'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { Controller, useForm } from 'react-hook-form';

import MenuPriceEditor from '@/components/admin/menuPriceEditor';
import TagInput from '@/components/admin/tagInput';
import { showToast } from '@/components/sonner';
import { useUpdateMenuMutation } from '@/hooks/mutations/useMenuMutation';
import { normalizeMenuTags } from '@/lib/menu';
import { updateMenuFormSchema, type UpdateMenuFormValues } from '@/schemas/menu';

import type { Menu, MenuCategory } from '@/types/menu';

const categoryOptions: Array<{ value: MenuCategory; label: string }> = [
  { value: 'cocktail', label: '칵테일' },
  { value: 'whisky', label: '위스키' },
  { value: 'non-alcohol', label: '논알콜' },
  { value: 'highball', label: '하이볼' },
  { value: 'beer', label: '맥주' },
  { value: 'side', label: '사이드' },
];

const inputClassName = 'rounded-lg border border-[#d7cec2] bg-white px-3 py-2';

const menuToFormValues = (menu: Menu): UpdateMenuFormValues => ({
  category: menu.category,
  name: menu.name,
  name_en: menu.name_en,
  description: menu.description,
  taste_note: menu.taste_note,
  abv: menu.abv,
  tags: normalizeMenuTags(menu.tags),
  is_signature: menu.is_signature,
  is_display: menu.is_display,
  is_sold_out: menu.is_sold_out,
  prices: [...menu.prices]
    .sort((a, b) => a.display_order - b.display_order)
    .map((price, index) => ({
      price_type: price.price_type,
      price: price.price,
      display_order: index + 1,
      is_active: true,
    })),
});

type MenuEditFormProps = {
  menu: Menu;
  onCancel: () => void;
};

const FormFieldError = ({ message }: { message?: string }) => {
  if (!message) {
    return null;
  }

  return <p className="text-xs text-red-600">{message}</p>;
};

const MenuEditForm = ({ menu, onCancel }: MenuEditFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateMenuFormValues>({
    resolver: zodResolver(updateMenuFormSchema),
    defaultValues: menuToFormValues(menu),
  });

  const { mutate: updateMenu } = useUpdateMenuMutation();

  const onSubmit = (values: UpdateMenuFormValues) => {
    updateMenu(
      { menuId: menu.id, menuData: values },
      {
        onSuccess: () => {
          showToast({ kind: 'success', message: '메뉴를 수정했어요.' });
        },
        onError: () => {
          showToast({
            kind: 'error',
            message: '메뉴를 수정하지 못했어요. 잠시 후 다시 시도해 주세요.',
          });
        },
      },
    );
    onCancel();
  };

  return (
    <form
      className="mt-4 grid gap-3 border-t border-[#e2d8cb] pt-4"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="grid gap-1">
        <select
          {...register('category')}
          className={clsx(inputClassName, errors.category && 'border-red-300')}
        >
          {categoryOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <FormFieldError message={errors.category?.message} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1">
          <input
            {...register('name')}
            placeholder="메뉴명"
            className={clsx(inputClassName, errors.name && 'border-red-300')}
          />
          <FormFieldError message={errors.name?.message} />
        </div>
        <div className="grid gap-1">
          <input
            {...register('name_en')}
            placeholder="영문명"
            className={clsx(inputClassName, errors.name_en && 'border-red-300')}
          />
          <FormFieldError message={errors.name_en?.message} />
        </div>
      </div>

      <div className="grid gap-1">
        <textarea
          {...register('description')}
          placeholder="설명"
          className={clsx('min-h-20', inputClassName, errors.description && 'border-red-300')}
        />
        <FormFieldError message={errors.description?.message} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1">
          <input
            {...register('abv', { valueAsNumber: true })}
            type="number"
            step="0.1"
            min={0}
            placeholder="ABV(도수)"
            className={clsx(inputClassName, errors.abv && 'border-red-300')}
          />
          <FormFieldError message={errors.abv?.message} />
        </div>
        <div className="grid gap-1">
          <input
            {...register('taste_note')}
            placeholder="Taste Note"
            className={clsx(inputClassName, errors.taste_note && 'border-red-300')}
          />
          <FormFieldError message={errors.taste_note?.message} />
        </div>
      </div>

      <Controller
        name="tags"
        control={control}
        render={({ field }) => (
          <TagInput tags={field.value} onChange={field.onChange} placeholder="태그 입력 후 Enter" />
        )}
      />

      <Controller
        name="prices"
        control={control}
        render={({ field }) => (
          <MenuPriceEditor key={menu.id} defaultPrices={field.value} onChange={field.onChange} />
        )}
      />

      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('is_signature')} />
          시그니처
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('is_display')} />
          메뉴판 표시
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('is_sold_out')} />
          품절
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-[#1f2937] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          저장
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-[#d7cec2] bg-white px-4 py-2 text-sm text-[#4b5563]"
        >
          닫기
        </button>
      </div>
    </form>
  );
};

export default MenuEditForm;
