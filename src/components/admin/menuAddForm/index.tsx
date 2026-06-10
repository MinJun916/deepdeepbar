'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import MenuPriceEditor from '@/components/admin/menuPriceEditor';
import TagInput from '@/components/admin/tagInput';
import { showToast } from '@/components/sonner';
import { useCreateMenuMutation } from '@/hooks/mutations/useMenuMutation';
import { createMenuFormSchema, type CreateMenuFormValues } from '@/schemas/menu';

import type { MenuCategory } from '@/types/menu';

const categoryOptions: Array<{ value: MenuCategory; label: string }> = [
  { value: 'cocktail', label: '칵테일' },
  { value: 'whisky', label: '위스키' },
  { value: 'non-alcohol', label: '논알콜' },
  { value: 'highball', label: '하이볼' },
  { value: 'beer', label: '맥주' },
  { value: 'side', label: '사이드' },
];

const inputClassName = 'rounded-lg border border-[#d7cec2] bg-white px-3 py-2';

const defaultValues: CreateMenuFormValues = {
  category: 'cocktail',
  name: '',
  name_en: '',
  description: '',
  taste_note: '',
  abv: 0,
  tags: [],
  prices: [],
  is_signature: false,
  is_display: true,
};

const FormFieldError = ({ message }: { message?: string }) => {
  if (!message) {
    return null;
  }

  return <p className="text-xs text-red-600">{message}</p>;
};

const MenuAddForm = () => {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateMenuMutation();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateMenuFormValues>({
    resolver: zodResolver(createMenuFormSchema),
    defaultValues,
  });

  const onSubmit = async (values: CreateMenuFormValues) => {
    try {
      await mutateAsync(values);
      showToast({ kind: 'success', message: '메뉴를 추가했어요.' });
      router.push('/admin/menu');
    } catch {
      showToast({ kind: 'error', message: '메뉴 추가에 실패했어요.' });
    }
  };

  return (
    <form
      className="grid gap-3 rounded-2xl border border-[#e2d8cb] bg-[#f8f3ec] p-5"
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

      <div className="grid gap-1">
        <textarea
          {...register('description')}
          placeholder="설명"
          className={clsx('min-h-24', inputClassName, errors.description && 'border-red-300')}
        />
        <FormFieldError message={errors.description?.message} />
      </div>

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
        render={({ field }) => <MenuPriceEditor onChange={field.onChange} />}
      />

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register('is_signature')} />
        시그니처 메뉴
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register('is_display')} />
        메뉴판에 표시
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-[#1f2937] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {isPending ? '추가 중...' : '메뉴 추가'}
      </button>
    </form>
  );
};

export default MenuAddForm;
