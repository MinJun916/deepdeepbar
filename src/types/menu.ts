type MenuPriceType = 'default' | 'shot' | 'bottle' | string;

export type MenuCategory = 'cocktail' | 'whisky' | 'non-alcohol' | 'highball' | 'beer' | 'side';

export type MenuPrice = {
  id: string;
  menu_id: string;
  price_type: MenuPriceType;
  price: number;
  display_order: number;
};

export type MenuPriceRequest = {
  price_type: MenuPriceType;
  price: number;
  display_order: number;
  is_active?: boolean;
};

export type Menu = {
  id: string;
  category: MenuCategory;
  name: string;
  name_en: string;
  description: string;
  taste_note: string;
  abv: number;
  tags: string[];
  is_signature: boolean;
  is_display: boolean;
  is_sold_out: boolean;
  prices: MenuPrice[];
};

export type MenuListResponse = {
  items: Menu[];
  has_next: boolean;
  next_offset: number | null;
};

export type CreateMenuRequest = {
  category: MenuCategory;
  name: string;
  name_en: string;
  description: string;
  taste_note: string;
  abv: number;
  tags: string[];
  is_signature: boolean;
  is_display: boolean;
  prices: MenuPriceRequest[];
};

export type UpdateMenuRequest = CreateMenuRequest & {
  is_sold_out: boolean;
};
