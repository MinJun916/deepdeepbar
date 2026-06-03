'use client';

type SearchToolbarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  queryPlaceholder: string;
  className?: string;
};

const inputClassName = 'rounded-lg border border-[#d7cec2] bg-white px-3 py-2';

const SearchToolbar = ({
  query,
  onQueryChange,
  queryPlaceholder,
  className,
}: SearchToolbarProps) => {
  return (
    <section
      className={
        className ??
        'mb-4 grid gap-2 rounded-2xl border border-[#e2d8cb] bg-[#f8f3ec] p-4'
      }
    >
      <input
        type="text"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={queryPlaceholder}
        className={inputClassName}
      />
    </section>
  );
};

export default SearchToolbar;
