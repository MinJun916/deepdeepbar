'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';

import RecipeStepsEditor from '@/components/admin/recipeStepsEditor';
import { showToast } from '@/components/sonner';
import { useUpdateRecipeMutation } from '@/hooks/mutations/useRecipeMutation';
import {
  glassTypeOptions,
  updateRecipeFormSchema,
  type UpdateRecipeFormValues,
} from '@/schemas/recipe';

import type { RecipeResponse } from '@/types/recipe';

const inputClassName = 'rounded-lg border border-[#d7cec2] bg-white px-3 py-2';

type RecipeEditFormProps = {
  recipe: RecipeResponse;
  onCancel: () => void;
  onSaved: (recipeId: string, values: UpdateRecipeFormValues) => void;
};

const FormFieldError = ({ message }: { message?: string }) => {
  if (!message) {
    return null;
  }

  return <p className="text-xs text-red-600">{message}</p>;
};

const recipeToFormValues = (recipe: RecipeResponse): UpdateRecipeFormValues => ({
  glass_type: recipe.glass_type.code,
  garnish: recipe.garnish ?? '',
  mixing_method: recipe.mixing_method ?? '',
  notes: recipe.notes ?? '',
  steps:
    recipe.steps.length > 0
      ? [...recipe.steps]
          .sort((a, b) => a.step_order - b.step_order)
          .map((step, index) => ({
            step_order: index + 1,
            instruction: step.instruction,
          }))
      : [{ step_order: 1, instruction: '' }],
});

const withOrderedSteps = (values: UpdateRecipeFormValues): UpdateRecipeFormValues => ({
  ...values,
  steps: values.steps.map((step, index) => ({
    ...step,
    step_order: index + 1,
  })),
});

const RecipeEditForm = ({ recipe, onCancel, onSaved }: RecipeEditFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateRecipeFormValues>({
    resolver: zodResolver(updateRecipeFormSchema),
    defaultValues: recipeToFormValues(recipe),
  });

  const { mutate: updateRecipe } = useUpdateRecipeMutation();

  const onSubmit = (values: UpdateRecipeFormValues) => {
    const payload = withOrderedSteps(values);

    updateRecipe(
      { recipeId: recipe.id, recipeData: payload },
      {
        onSuccess: () => {
          showToast({ kind: 'success', message: '레시피를 수정했어요.' });
          onSaved(recipe.id, payload);
          onCancel();
        },
        onError: () => {
          showToast({
            kind: 'error',
            message: '레시피를 수정하지 못했어요. 잠시 후 다시 시도해 주세요.',
          });
        },
      },
    );
  };

  return (
    <form
      className="mt-4 grid gap-3 border-t border-[#e2d8cb] pt-4"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="rounded-lg border border-[#e5d5c3] bg-white px-3 py-2 text-sm text-[#4b5563]">
        메뉴: <span className="font-medium text-[#1f2937]">{recipe.menu.name}</span>
        <span className="text-[#6b7280]"> ({recipe.menu.name_en})</span>
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
        <input {...register('garnish')} placeholder="가니쉬 (선택)" className={inputClassName} />
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
        control={control as never}
        register={register as never}
        errors={errors as never}
      />

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

export default RecipeEditForm;
