export type CocktailMenu = {
  id: string;
  category: 'cocktail' | 'whisky' | 'non-alcohol' | 'highball' | 'side';
  name: string;
  nameEn: string;
  description: string;
  price: number;
  tasteNote: string;
  abv: string;
  tags: string[];
  isSignature?: boolean;
};

type MenuCardProps = {
  menu: CocktailMenu;
  currency: Intl.NumberFormat;
};

const MenuCard = ({ menu, currency }: MenuCardProps) => {
  return (
    <article className="rounded-2xl border border-[#e0d5c8] bg-[linear-gradient(160deg,rgba(252,248,242,0.96)_0%,rgba(245,238,229,0.96)_100%)] p-4 shadow-[0_12px_26px_rgba(15,23,42,0.08)] backdrop-blur sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg leading-6 font-semibold tracking-tight text-[#111827]">
              {menu.name}
            </h2>
            {menu.isSignature ? (
              <span className="rounded-full border border-[#d3b391] bg-[#f4e6d8] px-2.5 py-1 text-[11px] font-semibold text-[#5a3d26]">
                SIGNATURE
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs font-medium tracking-wide text-[#6b7280]">{menu.nameEn}</p>
        </div>
        <p className="shrink-0 text-base font-semibold text-[#374151]">
          {currency.format(menu.price)}원
        </p>
      </div>

      <p className="mt-3 text-sm leading-6 break-keep text-[#374151]">{menu.description}</p>

      <dl className="mt-3 grid grid-cols-1 gap-2 text-xs text-[#6b7280] sm:grid-cols-2">
        <div className="rounded-lg border border-[#e2d8cb] bg-[#f6eee4] px-3 py-2">
          <dt className="font-medium text-[#84684c]">Taste</dt>
          <dd className="mt-0.5 break-keep text-[#374151]">{menu.tasteNote}</dd>
        </div>
        <div className="rounded-lg border border-[#e2d8cb] bg-[#f6eee4] px-3 py-2">
          <dt className="font-medium text-[#84684c]">ABV</dt>
          <dd className="mt-0.5 text-[#374151]">{menu.abv}</dd>
        </div>
      </dl>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {menu.tags.map((tag) => (
          <span
            key={`${menu.id}-${tag}`}
            className="rounded-full border border-[#e2d6c8] bg-[#f4ebdf] px-2.5 py-1 text-[11px] font-medium text-[#4b5563]"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
};

export default MenuCard;
