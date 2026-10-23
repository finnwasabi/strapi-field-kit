export const FILTERED_RELATION_UID = 'plugin::filtered-relation.filtered-relation';
const DOCUMENT_ID_PLACEHOLDER = '{{documentId}}';

// Same conversion as the admin input: a display name becomes "api::slug.slug".
export const parseCollectionName = (name?: string): string | null => {
  if (!name) return null;
  if (name.startsWith('api::')) return name;
  const slug = name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  return `api::${slug}.${slug}`;
};

interface FilterOptions {
  filterField1?: string;
  filterValue1?: string;
  filterField2?: string;
  filterValue2?: string;
}

// Static filters only: values bound to the current document cannot be resolved here.
export const buildStaticFilters = ({ filterField1, filterValue1, filterField2, filterValue2 }: FilterOptions) => {
  const filters: Record<string, string> = {};
  if (filterField1 && filterValue1 && filterValue1 !== DOCUMENT_ID_PLACEHOLDER) filters[filterField1] = filterValue1;
  if (filterField2 && filterValue2 && filterValue2 !== DOCUMENT_ID_PLACEHOLDER) filters[filterField2] = filterValue2;
  return filters;
};

type Entry = Record<string, any>;

export const collectRelatedIds = (items: Entry[], displayField?: string): Array<string | number> =>
  displayField
    ? items.flatMap((item) => {
        const related = item[displayField];
        const list = Array.isArray(related) ? related : related ? [related] : [];
        return list.map((rel: Entry) => rel?.documentId || rel?.id).filter(Boolean);
      })
    : [];
