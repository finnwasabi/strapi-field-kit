import { describe, expect, it } from 'vitest';

import {
  buildFilterQuery,
  describeFilters,
  guessRelationModel,
  parseCollectionName,
  resolveFilters,
  toRelatedItems,
} from './filters';

describe('parseCollectionName', () => {
  it('turns a display name into an API id', () => {
    expect(parseCollectionName('Meeting Participation Status')).toBe(
      'api::meeting-participation-status.meeting-participation-status'
    );
  });

  it('keeps API ids and ignores empty input', () => {
    expect(parseCollectionName('api::participation.participation')).toBe('api::participation.participation');
    expect(parseCollectionName('')).toBeNull();
  });
});

describe('guessRelationModel', () => {
  it('singularises a plural field name', () => {
    expect(guessRelationModel('investors')).toBe('api::investor.investor');
    expect(guessRelationModel('owner')).toBe('api::owner.owner');
  });
});

describe('resolveFilters', () => {
  it('replaces {{documentId}} with the current document', () => {
    expect(
      resolveFilters(
        { filterField1: 'status', filterValue1: 'Accepted', filterField2: 'event.documentId', filterValue2: '{{documentId}}' },
        'doc123'
      )
    ).toEqual({ status: 'Accepted', 'event.documentId': 'doc123' });
  });

  it('skips filters without a field or value', () => {
    expect(resolveFilters({ filterField1: 'status' }, 'doc')).toEqual({});
  });
});

describe('buildFilterQuery', () => {
  it('builds $and filters, nesting dotted keys and encoding values', () => {
    expect(buildFilterQuery({ status: 'In progress', 'event.documentId': 'a b' })).toBe(
      'filters[$and][0][status][$eq]=In%20progress&filters[$and][1][event][documentId][$eq]=a%20b'
    );
  });
});

describe('describeFilters', () => {
  it('shows the placeholder instead of the current id', () => {
    expect(describeFilters({ status: 'Accepted', event: 'doc1' }, 'doc1')).toBe(
      'status = Accepted, event = {{current documentId}}'
    );
  });
});

describe('toRelatedItems', () => {
  const context = {
    displayField: 'people',
    statusField: 'status',
    relationModel: 'api::person.person',
    targetModel: 'api::participation.participation',
  };

  it('makes one row per related entry', () => {
    const items = toRelatedItems(
      [
        {
          id: 1,
          documentId: 'p1',
          status: 'Accepted',
          people: [
            { id: 7, documentId: 'a', name: 'Ann' },
            { id: 8, documentId: 'b', firstName: 'Bo' },
          ],
        },
      ],
      context
    );
    expect(items).toEqual([
      { id: 'p1-a', label: 'Ann', originalId: 'p1', relatedDocumentId: 'a', relationModel: 'api::person.person', currentStatus: 'Accepted' },
      { id: 'p1-b', label: 'Bo', originalId: 'p1', relatedDocumentId: 'b', relationModel: 'api::person.person', currentStatus: 'Accepted' },
    ]);
  });

  it('handles a single relation and a count', () => {
    expect(toRelatedItems([{ id: 2, documentId: 'p2', people: { id: 9, documentId: 'c' } }], context)[0]).toMatchObject({
      label: 'ID: 9',
      relatedDocumentId: 'c',
    });
    expect(toRelatedItems([{ id: 3, people: { count: 4 } }], context)[0].label).toBe('4 items');
  });

  it('falls back to the record itself without a display field', () => {
    expect(toRelatedItems([{ id: 5, documentId: 'r5' }], { ...context, displayField: undefined })[0]).toMatchObject({
      label: 'ID: 5',
      relatedDocumentId: 'r5',
      relationModel: 'api::participation.participation',
    });
  });
});
