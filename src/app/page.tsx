import { type CocktailMenu } from '@/components/menu/menuCard';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import HomePageView from '@/views/home';

type CocktailRow = {
  id: string;
  category: CocktailMenu['category'];
  name: string;
  name_en: string;
  description: string;
  price: number;
  abv: number | null;
  taste_note: string;
  tags: string[] | null;
  is_signature: boolean | null;
};

const formatAbv = (abv: number | null) => {
  if (abv === null) {
    return '-';
  }

  return Number.isInteger(abv) ? `${abv}%` : `${abv.toFixed(1)}%`;
};

const HomePage = async () => {
  const supabase = createSupabaseServerClient();
  const cocktailsTable = process.env.NEXT_PUBLIC_SUPABASE_COCKTAILS_TABLE ?? 'Menu';

  const { data, error } = await supabase
    .schema('public')
    .from(cocktailsTable)
    .select(
      'id, category, name, name_en, description, price, abv, taste_note, tags, is_signature',
      {
        count: 'exact',
      },
    );

  if (error) {
    console.error(`Failed to fetch cocktails from public.${cocktailsTable}:`, error.message);
    return <HomePageView menuData={[]} />;
  }

  const menuData: CocktailMenu[] = ((data as CocktailRow[] | null) ?? []).map((row) => ({
    id: row.id,
    category: row.category,
    name: row.name,
    nameEn: row.name_en,
    description: row.description,
    price: row.price,
    abv: formatAbv(row.abv),
    tasteNote: row.taste_note,
    tags: row.tags ?? [],
    isSignature: row.is_signature ?? false,
  }));

  if (menuData.length === 0) {
    console.warn(
      `[Menu] public.${cocktailsTable} returned 0 rows. Check table name, imported rows, and RLS SELECT policy for anon role.`,
    );
  }

  return <HomePageView menuData={menuData} />;
};

export default HomePage;
