'use client';

import { createMenuAction } from '@/app/admin/actions';
import MenuPriceEditor from '@/components/admin/menuPriceEditor';
import useActionToast from '@/components/admin/useActionToast';

const categoryOptions = ['cocktail', 'whisky', 'non-alcohol', 'highball', 'beer', 'side'] as const;

const MenuAddFormClient = () => {
  const { isPending, runAction } = useActionToast();

  return (
    <form
      className="grid gap-3 rounded-2xl border border-[#e2d8cb] bg-[#f8f3ec] p-5"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        runAction(createMenuAction, formData, {
          loading: '메뉴 추가 중...',
          success: '메뉴를 추가했어요.',
          error: '메뉴 추가에 실패했어요',
        });
      }}
    >
      <select
        name="category"
        className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
        defaultValue="cocktail"
        required
      >
        {categoryOptions.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <input
        name="name"
        placeholder="name"
        className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
        required
      />
      <input
        name="name_en"
        placeholder="name_en"
        className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
        required
      />
      <textarea
        name="description"
        placeholder="description"
        className="min-h-24 rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
        required
      />
      <input
        name="abv"
        type="number"
        step="0.1"
        placeholder="abv (optional)"
        className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
      />
      <input
        name="taste_note"
        placeholder="taste_note"
        className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
        required
      />
      <textarea
        name="tags"
        placeholder='tags JSON or comma list (ex: ["Signature","Gin Base"])'
        className="min-h-20 rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
        defaultValue="[]"
      />
      <MenuPriceEditor name="price_options" />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="is_signature" />
        is_signature
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="is_display" defaultChecked />
        is_display
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-[#1f2937] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {isPending ? '처리 중...' : '메뉴 추가'}
      </button>
    </form>
  );
};

export default MenuAddFormClient;
