const splitLines = (text: string) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

// The Content-Type Builder stores "Initial Options" as one newline-separated
// string, but schemas edited by hand may hold a JSON array or a plain array.
export const parseInitialOptions = (raw: unknown): string[] => {
  if (typeof raw === 'string') {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      // not JSON, fall through to newline-separated text
    }
    return splitLines(raw);
  }

  return Array.isArray(raw) ? raw.map(String) : [];
};

// Keep a saved value selectable even when it is no longer in the initial list.
export const withValue = (options: string[], value: unknown): string[] =>
  typeof value === 'string' && value && !options.includes(value) ? [...options, value] : options;

export const filterOptions = (options: string[], search: string): string[] => {
  const needle = search.toLowerCase();
  return options.filter((option) => option.toLowerCase().includes(needle));
};
