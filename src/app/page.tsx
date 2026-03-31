import { type CocktailMenu } from '@/components/menu/menuCard';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import HomePageView from '@/views/home';

type CocktailRow = {
  id: string;
  category: CocktailMenu['category'];
  name: string;
  name_en: string;
  description: string;
  abv: number | null;
  taste_note: string;
  tags: string[] | null;
  is_signature: boolean | null;
};

type MenuPriceRow = {
  menu_id: string;
  price_type: 'default' | 'shot' | 'bottle' | string;
  price: number;
  display_order: number;
  is_active: boolean;
};

const formatAbv = (abv: number | null) => {
  if (abv === null) {
    return '-';
  }

  return Number.isInteger(abv) ? `${abv}%` : `${abv.toFixed(1)}%`;
};

const HomePage = async () => {
  const supabase = createSupabaseServerClient();
  const menusTable =
    process.env.NEXT_PUBLIC_SUPABASE_MENUS_TABLE ??
    process.env.NEXT_PUBLIC_SUPABASE_COCKTAILS_TABLE ??
    'menus';
  const menuPricesTable = process.env.NEXT_PUBLIC_SUPABASE_MENU_PRICES_TABLE ?? 'menu_prices';

  const { data: menuRows, error: menuError } = await supabase
    .schema('public')
    .from(menusTable)
    .select('id, category, name, name_en, description, abv, taste_note, tags, is_signature', {
      count: 'exact',
    });

  if (menuError) {
    console.error(`Failed to fetch menus from public.${menusTable}:`, menuError.message);
    return <HomePageView menuData={[]} />;
  }

  const { data: menuPriceRows, error: menuPriceError } = await supabase
    .schema('public')
    .from(menuPricesTable)
    .select('menu_id, price_type, price, display_order, is_active')
    .eq('is_active', true);

  if (menuPriceError) {
    console.error(
      `Failed to fetch menu prices from public.${menuPricesTable}:`,
      menuPriceError.message,
    );
    return <HomePageView menuData={[]} />;
  }

  const activePricesByMenuId = ((menuPriceRows as MenuPriceRow[] | null) ?? []).reduce<
    Record<string, MenuPriceRow[]>
  >((acc, row) => {
    const key = row.menu_id;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(row);
    return acc;
  }, {});

  const menuData: CocktailMenu[] = ((menuRows as CocktailRow[] | null) ?? []).map((row) => ({
    id: row.id,
    category: row.category,
    name: row.name,
    nameEn: row.name_en,
    description: row.description,
    priceOptions: (activePricesByMenuId[row.id] ?? [])
      .sort((a, b) => a.display_order - b.display_order)
      .map((priceOption) => ({
        priceType: priceOption.price_type,
        price: priceOption.price,
        displayOrder: priceOption.display_order,
      })),
    abv: formatAbv(row.abv),
    tasteNote: row.taste_note,
    tags: row.tags ?? [],
    isSignature: row.is_signature ?? false,
  }));

  if (menuData.length === 0) {
    console.warn(
      `[Menu] public.${menusTable} returned 0 rows. Check table name, imported rows, and RLS SELECT policy for anon role.`,
    );
  }

  return <HomePageView menuData={menuData} />;
};

export default HomePage;
