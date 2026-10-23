const ISO_DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})(T[\d:.]+Z?)?$/;
const TIME_REGEX = /^(\d{2}):(\d{2}):(\d{2})(\.\d{3})?$/;

// Dates read as MM/DD/YYYY and times as HH:MM; anything else is used as is.
export const formatFieldValue = (value: unknown): string => {
  if (value === null || value === undefined) return '';

  if (value instanceof Date) {
    return value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  const text = String(value);

  const dateMatch = ISO_DATE_REGEX.exec(text);
  if (dateMatch) {
    const [, year, month, day] = dateMatch;
    return `${month}/${day}/${year}`;
  }

  const timeMatch = TIME_REGEX.exec(text);
  if (timeMatch) return `${timeMatch[1]}:${timeMatch[2]}`;

  return text;
};

// Relations and other objects contribute their name, title or label.
export const toDisplayText = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object' && !(value instanceof Date)) {
    const { name, title, label } = value as Record<string, unknown>;
    return String(name || title || label || '');
  }
  return formatFieldValue(value);
};

// A space-only separator joins with single spaces; other separators get spaces around them.
export const joinParts = (parts: string[], separator: string): string => {
  const clean = separator.trim();
  return (clean === '' ? parts.join(' ') : parts.join(` ${clean} `)).trim();
};

export const parseFields = (config: unknown): string[] =>
  typeof config === 'string'
    ? config
        .split('\n')
        .map((field) => field.trim())
        .filter(Boolean)
    : [];

const getPath = (source: unknown, path: string): unknown =>
  path.split('.').reduce<unknown>((current, key) => {
    if (current === null || current === undefined) return undefined;
    return (current as Record<string, unknown>)[key];
  }, source);

// Source field names are relative to the composite field, so a composite inside a
// component (e.g. "contacts.0.display") reads its siblings ("contacts.0.firstName").
export const resolveFieldPath = (compositeName: string, field: string): string => {
  const parent = compositeName.split('.').slice(0, -1).join('.');
  return parent ? `${parent}.${field}` : field;
};

export const readSourceValues = (values: unknown, compositeName: string, fields: string[]) =>
  fields.map((field) => getPath(values, resolveFieldPath(compositeName, field)));

export const compose = (
  values: unknown,
  compositeName: string,
  fields: string[],
  separator: string
): string =>
  joinParts(
    readSourceValues(values, compositeName, fields).map(toDisplayText).filter(Boolean),
    separator
  );
