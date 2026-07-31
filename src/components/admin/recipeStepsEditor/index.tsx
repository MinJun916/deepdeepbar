'use client';

import clsx from 'clsx';
import { useFieldArray, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';

type RecipeStepFieldValues = {
  steps: Array<{
    step_order: number;
    instruction: string;
  }>;
};

type RecipeStepsEditorProps = {
  // Create/Update 폼 모두 steps 필드만 사용하므로 느슨한 Control로 공유
  control: Control<RecipeStepFieldValues>;
  register: UseFormRegister<RecipeStepFieldValues>;
  errors: FieldErrors<RecipeStepFieldValues>;
};

const inputClassName = 'rounded-lg border border-[#d7cec2] bg-white px-3 py-2';

const RecipeStepsEditor = ({ control, register, errors }: RecipeStepsEditorProps) => {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'steps',
  });

  const addStep = () => {
    append({
      step_order: fields.length + 1,
      instruction: '',
    });
  };

  const handleRemove = (index: number) => {
    if (fields.length <= 1) {
      update(0, { step_order: 1, instruction: '' });
      return;
    }

    remove(index);
  };

  const stepErrors = errors.steps;

  return (
    <div className="rounded-lg border border-[#d7cec2] bg-white p-3">
      <p className="mb-2 text-xs font-medium text-[#6b7280]">제조 단계</p>
      <div className="space-y-2">
        {fields.map((field, index) => {
          const instructionError = stepErrors?.[index]?.instruction?.message;

          return (
            <div key={field.id} className="grid gap-1">
              <div className="grid grid-cols-[40px_1fr_auto] items-start gap-2">
                <span className="mt-2 text-sm font-medium text-[#6b7280]">{index + 1}</span>
                <textarea
                  {...register(`steps.${index}.instruction`)}
                  rows={2}
                  placeholder={`${index + 1}단계 설명`}
                  className={clsx(
                    'min-h-[2.75rem] resize-y',
                    inputClassName,
                    instructionError && 'border-red-300',
                  )}
                />
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="mt-1 rounded-md border border-[#e5d5c3] px-2 py-1 text-xs text-[#7a5a40]"
                >
                  삭제
                </button>
              </div>
              {instructionError ? (
                <p className="pl-12 text-xs text-red-600">{instructionError}</p>
              ) : null}
            </div>
          );
        })}
      </div>
      {typeof stepErrors?.message === 'string' || typeof stepErrors?.root?.message === 'string' ? (
        <p className="mt-2 text-xs text-red-600">
          {stepErrors.message ?? stepErrors.root?.message}
        </p>
      ) : null}
      <button
        type="button"
        onClick={addStep}
        className="mt-2 rounded-md border border-[#d7cec2] bg-[#f8f3ec] px-2.5 py-1 text-xs text-[#4b5563]"
      >
        단계 추가
      </button>
    </div>
  );
};

export default RecipeStepsEditor;
