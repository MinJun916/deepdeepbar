'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import MenuPriceEditor from '@/components/admin/menuPriceEditor';
import TagInput from '@/components/admin/tagInput';
import { showToast } from '@/components/sonner';
import { useCreateMenuMutation } from '@/hooks/mutations/useMenuMutation';

import type { CreateMenuRequest, MenuCategory, MenuPriceRequest } from '@/types/menu';

const categoryOptions: Array<{ value: MenuCategory; label: string }> = [
  { value: 'cocktail', label: '칵테일' },
  { value: 'whisky', label: '위스키' },
  { value: 'non-alcohol', label: '논알콜' },
  { value: 'highball', label: '하이볼' },
  { value: 'beer', label: '맥주' },
  { value: 'side', label: '사이드' },
];

const inputClassName = 'rounded-lg border border-[#d7cec2] bg-white px-3 py-2';

const MenuAddForm = () => {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateMenuMutation();

  const [category, setCategory] = useState<MenuCategory>('cocktail');
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [description, setDescription] = useState('');
  const [abv, setAbv] = useState('');
  const [tasteNote, setTasteNote] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [prices, setPrices] = useState<MenuPriceRequest[]>([]);
  const [isSignature, setIsSignature] = useState(false);
  const [isDisplay, setIsDisplay] = useState(true);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedAbv = abv.trim() ? Number.parseFloat(abv) : 0;
    if (abv.trim() && !Number.isFinite(parsedAbv)) {
      showToast({ kind: 'error', message: '도수(ABV) 형식이 올바르지 않아요.' });
      return;
    }

    const payload: CreateMenuRequest = {
      category,
      name: name.trim(),
      name_en: nameEn.trim(),
      description: description.trim(),
      taste_note: tasteNote.trim(),
      abv: parsedAbv,
      tags,
      is_signature: isSignature,
      is_display: isDisplay,
      prices,
    };

    try {
      await mutateAsync(payload);
      showToast({ kind: 'success', message: '메뉴를 추가했어요.' });
      router.push('/admin/menu');
    } catch {
      showToast({ kind: 'error', message: '메뉴 추가에 실패했어요.' });
    }
  };

  return (
    <form
      className="grid gap-3 rounded-2xl border border-[#e2d8cb] bg-[#f8f3ec] p-5"
      onSubmit={handleSubmit}
    >
      <select
        value={category}
        onChange={(event) => setCategory(event.target.value as MenuCategory)}
        className={inputClassName}
        required
      >
        {categoryOptions.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="메뉴명"
        className={inputClassName}
        required
      />
      <input
        value={nameEn}
        onChange={(event) => setNameEn(event.target.value)}
        placeholder="영문명"
        className={inputClassName}
        required
      />
      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="설명"
        className={`min-h-24 ${inputClassName}`}
        required
      />
      <input
        value={abv}
        onChange={(event) => setAbv(event.target.value)}
        type="number"
        step="0.1"
        min={0}
        placeholder="도수 ABV (선택)"
        className={inputClassName}
      />
      <input
        value={tasteNote}
        onChange={(event) => setTasteNote(event.target.value)}
        placeholder="테이스트 노트"
        className={inputClassName}
        required
      />
      <TagInput tags={tags} onChange={setTags} placeholder="태그 입력 후 Enter" />
      <MenuPriceEditor onChange={setPrices} />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isSignature}
          onChange={(event) => setIsSignature(event.target.checked)}
        />
        시그니처 메뉴
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isDisplay}
          onChange={(event) => setIsDisplay(event.target.checked)}
        />
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
