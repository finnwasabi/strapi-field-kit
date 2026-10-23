export const DOCUMENT_ID_PLACEHOLDER = '{{documentId}}';

export interface FilteredRelationOptions {
  targetModel?: string;
  filterField1?: string;
  filterValue1?: string;
  filterField2?: string;
  filterValue2?: string;
  displayField?: string;
  statusField?: string;
}

// "Meeting Participation Status" -> "api::meeting-participation-status.meeting-participation-status"
export const parseCollectionName = (name?: string): string | null => {
  if (!name) return null;
  if (name.startsWith('api::')) return name;
  const slug = name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  return `api::${slug}.${slug}`;
};

// Last resort when the schema can't be read: "investors" -> "api::investor.investor".
export const guessRelationModel = (fieldName?: string): string | null => {
  if (!fieldName) return null;
  const singular = fieldName.endsWith('s') ? fieldName.slice(0, -1) : fieldName;
  const slug = singular.toLowerCase().replace(/[^a-z0-9-]/g, '');
  return `api::${slug}.${slug}`;
};

const resolveValue = (value: string, documentId: string | null) =>
  value === DOCUMENT_ID_PLACEHOLDER ? documentId : value;

export const resolveFilters = (
  { filterField1, filterValue1, filterField2, filterValue2 }: FilteredRelationOptions,
  documentId: string | null
): Record<string, string | null> => {
  const filters: Record<string, string | null> = {};
  if (filterField1 && filterValue1) filters[filterField1] = resolveValue(filterValue1, documentId);
  if (filterField2 && filterValue2) filters[filterField2] = resolveValue(filterValue2, documentId);
  return filters;
};

// "event.documentId" filters on a field of a relation.
export const buildFilterQuery = (filters: Record<string, string | null>): string =>
  Object.entries(filters)
    .map(([key, value], index) => {
      const path = key
        .split('.')
        .map((part) => `[${part}]`)
        .join('');
      return `filters[$and][${index}]${path}[$eq]=${encodeURIComponent(value ?? '')}`;
    })
    .join('&');

export const describeFilters = (filters: Record<string, string | null>, documentId: string | null): string =>
  Object.entries(filters)
    .map(([key, value]) => `${key} = ${value === documentId ? '{{current documentId}}' : value}`)
    .join(', ');

export interface RelatedItem {
  id: string;
  label: string;
  originalId?: string;
  relatedDocumentId?: string;
  relationModel?: string | null;
  currentStatus?: string;
}

type Entry = Record<string, any>;

const labelOf = (entry: Entry, fallbackId: unknown) =>
  entry.fullName || entry.name || entry.displayName || entry.firstName || `ID: ${fallbackId}`;

// One row per related entry, so a record linking three people shows three rows.
export const toRelatedItems = (
  records: Entry[],
  { displayField, statusField, relationModel, targetModel }: {
    displayField?: string;
    statusField?: string;
    relationModel: string | null;
    targetModel: string | null;
  }
): RelatedItem[] =>
  records.flatMap((record): RelatedItem[] => {
    const recordId = record.documentId || record.id;
    const currentStatus = statusField ? record[statusField] : undefined;
    const related = displayField ? record[displayField] : undefined;

    if (!displayField || !related) {
      return [
        {
          id: String(record.id),
          label: `ID: ${record.id}`,
          originalId: recordId,
          relatedDocumentId: recordId,
          relationModel: targetModel,
          currentStatus,
        },
      ];
    }

    if (Array.isArray(related)) {
      return related.map((rel: Entry) => ({
        id: `${recordId}-${rel.documentId || rel.id}`,
        label: labelOf(rel, rel.documentId || rel.id),
        originalId: recordId,
        relatedDocumentId: rel.documentId || rel.id,
        relationModel,
        currentStatus,
      }));
    }

    if (typeof related !== 'object') return [];

    if (related.count !== undefined) {
      return [{ id: String(record.id), label: `${related.count} items`, currentStatus }];
    }

    return [
      {
        id: String(record.id),
        label: labelOf(related, related.id),
        originalId: recordId,
        relatedDocumentId: related.documentId || related.id,
        relationModel,
        currentStatus,
      },
    ];
  });
