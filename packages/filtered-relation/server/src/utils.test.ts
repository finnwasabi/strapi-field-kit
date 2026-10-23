import { describe, expect, it } from 'vitest';

import { buildStaticFilters, collectRelatedIds, parseCollectionName } from './utils';

describe('server utils', () => {
  it('parses collection names like the admin input', () => {
    expect(parseCollectionName('Participation')).toBe('api::participation.participation');
    expect(parseCollectionName(undefined)).toBeNull();
  });

  it('drops filters bound to the current document', () => {
    expect(
      buildStaticFilters({
        filterField1: 'status',
        filterValue1: 'Accepted',
        filterField2: 'event',
        filterValue2: '{{documentId}}',
      })
    ).toEqual({ status: 'Accepted' });
  });

  it('collects ids from single and many relations', () => {
    expect(
      collectRelatedIds(
        [{ people: [{ documentId: 'a' }, { id: 2 }] }, { people: { documentId: 'c' } }, { people: null }],
        'people'
      )
    ).toEqual(['a', 2, 'c']);
    expect(collectRelatedIds([{ people: [{ documentId: 'a' }] }], undefined)).toEqual([]);
  });
});
