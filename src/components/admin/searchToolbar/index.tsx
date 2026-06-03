'use client';

type Option = {
  value: string;
  label: string;
};

type SearchToolbarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  queryPlaceholder: string;
  sortValue?: string;
  onSortChange?: (value: string) => void;
  sortOptions?: readonly Option[];
  secondaryValue?: string;
  onSecondaryChange?: (value: string) => void;
  secondaryOptions?: readonly Option[];
  className?: string;
};

const inputClassName = 'rounded-lg border border-[#d7cec2] bg-white px-3 py-2';

const SearchToolbar = ({
  query,
  onQueryChange,
  queryPlaceholder,
  sortValue,
  onSortChange,
  sortOptions,
  secondaryValue,
  onSecondaryChange,
  secondaryOptions,
  className,
}: SearchToolbarProps) => {
  const hasSort = Boolean(sortOptions?.length && onSortChange);
  const hasSecondary = Boolean(secondaryOptions?.length && onSecondaryChange);

  const defaultClassName =
    hasSecondary && hasSort
      ? 'mb-4 grid gap-2 rounded-2xl border border-[#e2d8cb] bg-[#f8f3ec] p-4 sm:grid-cols-[1fr_220px_220px]'
      : hasSecondary || hasSort
        ? 'mb-4 grid gap-2 rounded-2xl border border-[#e2d8cb] bg-[#f8f3ec] p-4 sm:grid-cols-[1fr_220px]'
        : 'mb-4 grid gap-2 rounded-2xl border border-[#e2d8cb] bg-[#f8f3ec] p-4';

  return (
    <section className={className ?? defaultClassName}>
      <input
        type="text"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={queryPlaceholder}
        className={inputClassName}
      />
      {hasSecondary ? (
        <select
          value={secondaryValue}
          onChange={(event) => onSecondaryChange?.(event.target.value)}
          className={inputClassName}
        >
          {secondaryOptions?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null}
      {hasSort ? (
        <select
          value={sortValue}
          onChange={(event) => onSortChange?.(event.target.value)}
          className={inputClassName}
        >
          {sortOptions?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null}
    </section>
  );
};

export default SearchToolbar;
