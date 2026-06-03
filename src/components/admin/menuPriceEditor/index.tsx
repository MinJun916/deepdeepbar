'use client';

import { useState } from 'react';

import type { MenuPriceRequest } from '@/types/menu';

type PriceType = 'default' | 'shot' | 'bottle';

type PriceOptionRow = {
  id: string;
  priceType: PriceType;
  price: string;
};

type MenuPriceEditorProps = {
  onChange: (prices: MenuPriceRequest[]) => void;
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

const rowsToPrices = (rows: PriceOptionRow[]): MenuPriceRequest[] => {
  const prices: MenuPriceRequest[] = [];

  rows.forEach((row, index) => {
    const price = Number.parseInt(row.price, 10);
    if (!Number.isFinite(price)) {
      return;
    }

    prices.push({
      price_type: row.priceType,
      price,
      display_order: index + 1,
      is_active: true,
    });
  });

  return prices;
};

const MenuPriceEditor = ({ onChange }: MenuPriceEditorProps) => {
  const [rows, setRows] = useState<PriceOptionRow[]>(() => [createRow()]);

  const syncRows = (nextRows: PriceOptionRow[]) => {
    setRows(nextRows);
    onChange(rowsToPrices(nextRows));
  };

  const updateRow = (
    rowId: string,
    key: keyof Pick<PriceOptionRow, 'priceType' | 'price'>,
    fieldValue: string,
  ) => {
    syncRows(rows.map((row) => (row.id === rowId ? { ...row, [key]: fieldValue } : row)));
  };

  const addRow = () => {
    syncRows([...rows, createRow()]);
  };

  const removeRow = (rowId: string) => {
    const nextRows = rows.length <= 1 ? [createRow()] : rows.filter((row) => row.id !== rowId);
    syncRows(nextRows);
  };

  return (
    <div className="rounded-lg border border-[#d7cec2] bg-white p-3">
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
