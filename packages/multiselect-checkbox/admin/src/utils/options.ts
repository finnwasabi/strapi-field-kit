export interface Option {
  label: string;
  value: string;
}

// Each line of the field's options is "label" or "label:value"; only the first colon splits.
export const parseOptions = (raw: unknown): Option[] =>
  (Array.isArray(raw) ? raw : [])
    .map((line): Option | null => {
      const text = String(line);
      const index = text.indexOf(':');
      const [label, value] = index === -1 ? [text, text] : [text.slice(0, index), text.slice(index + 1)];
      return label && value ? { label, value } : null;
    })
    .filter((option): option is Option => option !== null);

// Stored values are a JSON array (or its string). Unknown values are dropped so the
// checkboxes only ever reflect options that still exist.
export const readSelected = (value: unknown, options: Option[]): string[] => {
  let parsed: unknown = value ?? [];
  if (typeof value === 'string') {
    try {
      parsed = JSON.parse(value || '[]');
    } catch {
      return [];
    }
  }
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((item): item is string => options.some((option) => option.value === item));
};

export const toggleValue = (selected: string[], value: string, checked: boolean): string[] =>
  checked ? [...selected.filter((item) => item !== value), value] : selected.filter((item) => item !== value);

export type SelectionError =
  | { id: 'error.no-options' }
  | { id: 'error.min'; min: number }
  | { id: 'error.max'; max: number }
  | null;

export const validateSelection = ({
  count,
  optionCount,
  required,
  min,
  max,
}: {
  count: number;
  optionCount: number;
  required?: boolean;
  min?: number;
  max?: number;
}): SelectionError => {
  if (required && optionCount === 0) return { id: 'error.no-options' };
  if (min !== undefined && count < min && (required || count > 0)) return { id: 'error.min', min };
  if (max !== undefined && count > max) return { id: 'error.max', max };
  return null;
};
