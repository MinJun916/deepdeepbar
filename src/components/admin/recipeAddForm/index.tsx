'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import RecipeStepsEditor from '@/components/admin/recipeStepsEditor';
import { showToast } from '@/components/sonner';
import { useMenusQuery } from '@/hooks/queries/useMenuQuery';
import {
  createRecipeFormSchema,
  glassTypeOptions,
  type CreateRecipeFormValues,
} from '@/schemas/recipe';

const inputClassName = 'rounded-lg border border-[#d7cec2] bg-white px-3 py-2';

const defaultValues: CreateRecipeFormValues = {
  menu_id: '',
  glass_type: 'rocks_glass',
  garnish: '',
  mixing_method: '',
  notes: '',
  steps: [{ step_order: 1, instruction: '' }],
};

const FormFieldError = ({ message }: { message?: string }) => {
  if (!message) {
    return null;
  }

  return <p className="text-xs text-red-600">{message}</p>;
};

const withOrderedSteps = (values: CreateRecipeFormValues): CreateRecipeFormValues => ({
  ...values,
  steps: values.steps.map((step, index) => ({
    ...step,
    step_order: index + 1,
  })),
});

const RecipeAddForm = () => {
  const router = useRouter();
  const { data: menus = [], isLoading: isMenusLoading } = useMenusQuery();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateRecipeFormValues>({
    resolver: zodResolver(createRecipeFormSchema),
    defaultValues,
  });

  const onSubmit = (values: CreateRecipeFormValues) => {
    const payload = withOrderedSteps(values);

    // TODO: POST /recipes — createRecipe(payload) mutation 연동
    console.log('[createRecipe]', payload);
    showToast({ kind: 'success', message: '레시피를 추가했어요. (API 연동 전)' });
    router.push('/admin/recipe/manage');
  };

  return (
    <form
      className="grid gap-3 rounded-2xl border border-[#e2d8cb] bg-[#f8f3ec] p-5"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="grid gap-1">
        <label className="text-xs font-medium text-[#6b7280]">메뉴</label>
        <select
          {...register('menu_id')}
          disabled={isMenusLoading}
          className={clsx(inputClassName, errors.menu_id && 'border-red-300')}
        >
          <option value="">{isMenusLoading ? '메뉴 불러오는 중...' : '메뉴 선택'}</option>
          {menus.map((menu) => (
            <option key={menu.id} value={menu.id}>
              {menu.name} ({menu.name_en})
            </option>
          ))}
        </select>
        <FormFieldError message={errors.menu_id?.message} />
      </div>

      <div className="grid gap-1">
        <label className="text-xs font-medium text-[#6b7280]">잔 종류</label>
        <select
          {...register('glass_type')}
          className={clsx(inputClassName, errors.glass_type && 'border-red-300')}
        >
          {glassTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <FormFieldError message={errors.glass_type?.message} />
      </div>

      <div className="grid gap-1">
        <label className="text-xs font-medium text-[#6b7280]">제조 방식</label>
        <input
          {...register('mixing_method')}
          placeholder="예: 빌드 / 쉐이크 / 스터"
          className={clsx(inputClassName, errors.mixing_method && 'border-red-300')}
        />
        <FormFieldError message={errors.mixing_method?.message} />
      </div>

      <div className="grid gap-1">
        <label className="text-xs font-medium text-[#6b7280]">가니쉬</label>
        <input
          {...register('garnish')}
          placeholder="가니쉬 (선택)"
          className={inputClassName}
        />
      </div>

      <div className="grid gap-1">
        <label className="text-xs font-medium text-[#6b7280]">메모</label>
        <textarea
          {...register('notes')}
          placeholder="메모 (선택)"
          className={`min-h-20 ${inputClassName}`}
        />
      </div>

      <RecipeStepsEditor
        // Create/Update 폼의 steps 필드만 공유
        control={control as never}
        register={register as never}
        errors={errors as never}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-[#1f2937] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {isSubmitting ? '추가 중...' : '레시피 추가'}
      </button>
    </form>
  );
};

export default RecipeAddForm;
