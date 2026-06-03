export const formatAbv = (abv: number | null | undefined) => {
  if (abv == null) {
    return '-';
  }

  return Number.isInteger(abv) ? `${abv}%` : `${abv.toFixed(1)}%`;
};

/** DB에 JSON 문자열이 잘못 쪼개져 들어온 tags 배열을 보정합니다. */
export const normalizeMenuTags = (tags: string[]): string[] => {
  if (!tags.length) {
    return [];
  }

  const joined = tags.join(',').replace(/[""]/g, '"');

  if (joined.trimStart().startsWith('[')) {
    try {
      const parsed = JSON.parse(joined) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.map((tag) => String(tag).trim()).filter(Boolean);
      }
    } catch {
      // fall through to per-item cleanup
    }
  }

  return tags
    .map((tag) =>
      tag
        .replace(/^\[+|\]+$/g, '')
        .replace(/^["'“]+|["'”]+$/g, '')
        .trim(),
    )
    .filter(Boolean);
};
