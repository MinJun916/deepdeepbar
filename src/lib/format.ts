import type { PriceType } from '@/types/order';

const currencyFormatter = new Intl.NumberFormat('ko-KR');

export const formatWon = (amount: number) => `${currencyFormatter.format(amount)}원`;

export const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));

export const PRICE_TYPE_LABEL: Record<PriceType, string> = {
  default: '기본',
  shot: '잔·샷',
  bottle: '보틀',
};
