'use client';

import { useMemo, useState } from 'react';

type PriceType = 'default' | 'shot' | 'bottle';

type PriceOptionRow = {
  id: string;
  priceType: PriceType;
  price: string;
};

type MenuPriceEditorProps = {
  name: string;
  defaultSerializedValue?: string;
};

const priceTypeOptions: Array<{ value: PriceType; label: string }> = [
  { value: 'default', label: '기본' },
  { value: 'shot', label: '샷' },
  { value: 'bottle', label: '보틀' },
];

const createRow = (priceType: PriceType = 'default', price = ''): PriceOptionRow => ({
  id: crypto.randomUUID(),
  priceType,
  price,
});

const parseSerializedValue = (value?: string) => {
  if (!value) {
    return [createRow()];
  }

  const rows = value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [typeRaw, priceRaw] = line.split('|').map((part) => part.trim());
      const priceType: PriceType =
        typeRaw === 'shot' || typeRaw === 'bottle' || typeRaw === 'default' ? typeRaw : 'default';
      return createRow(priceType, priceRaw ?? '');
    });

  return rows.length > 0 ? rows : [createRow()];
};

const MenuPriceEditor = ({ name, defaultSerializedValue }: MenuPriceEditorProps) => {
  const [rows, setRows] = useState<PriceOptionRow[]>(parseSerializedValue(defaultSerializedValue));

  const serializedValue = useMemo(
    () =>
      rows
        .map((row) => `${row.priceType}|${row.price.trim()}`)
        .filter((line) => {
          const [, price] = line.split('|');
          return Boolean(price);
        })
        .join('\n'),
    [rows],
  );

  const updateRow = (
    rowId: string,
    key: keyof Pick<PriceOptionRow, 'priceType' | 'price'>,
    value: string,
  ) => {
    setRows((prev) => prev.map((row) => (row.id === rowId ? { ...row, [key]: value } : row)));
  };

  const addRow = () => setRows((prev) => [...prev, createRow()]);
  const removeRow = (rowId: string) => {
    setRows((prev) => {
      if (prev.length <= 1) {
        return [createRow()];
      }
      return prev.filter((row) => row.id !== rowId);
    });
  };

  return (
    <div className="rounded-lg border border-[#d7cec2] bg-white p-3">
      <input type="hidden" name={name} value={serializedValue} />
      <p className="mb-2 text-xs font-medium text-[#6b7280]">옵션 가격</p>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.id} className="grid grid-cols-[120px_1fr_auto] items-center gap-2">
            <select
              value={row.priceType}
              onChange={(event) => updateRow(row.id, 'priceType', event.target.value)}
              className="rounded-md border border-[#d7cec2] px-2 py-1.5 text-sm"
            >
              {priceTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={0}
              value={row.price}
              onChange={(event) => updateRow(row.id, 'price', event.target.value)}
              placeholder="가격"
              className="rounded-md border border-[#d7cec2] px-2 py-1.5 text-sm"
            />
            <button
              type="button"
              onClick={() => removeRow(row.id)}
              className="rounded-md border border-[#e5d5c3] px-2 py-1 text-xs text-[#7a5a40]"
            >
              삭제
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addRow}
        className="mt-2 rounded-md border border-[#d7cec2] bg-[#f8f3ec] px-2.5 py-1 text-xs text-[#4b5563]"
      >
        옵션 행 추가
      </button>
    </div>
  );
};

export default MenuPriceEditor;
