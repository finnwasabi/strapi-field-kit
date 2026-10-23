import { describe, expect, it } from 'vitest';

import { compose, formatFieldValue, joinParts, parseFields, resolveFieldPath, toDisplayText } from './compose';

describe('formatFieldValue', () => {
  it('formats ISO dates as MM/DD/YYYY', () => {
    expect(formatFieldValue('2026-06-18')).toBe('06/18/2026');
    expect(formatFieldValue('2026-06-18T08:30:00.000Z')).toBe('06/18/2026');
  });

  it('formats times as HH:MM', () => {
    expect(formatFieldValue('08:30:00')).toBe('08:30');
    expect(formatFieldValue('08:30:00.000')).toBe('08:30');
  });

  it('passes other values through as text', () => {
    expect(formatFieldValue('Ms')).toBe('Ms');
    expect(formatFieldValue(42)).toBe('42');
    expect(formatFieldValue(null)).toBe('');
  });
});

describe('toDisplayText', () => {
  it('uses name, then title, then label of an object', () => {
    expect(toDisplayText({ name: 'Acme', title: 'x' })).toBe('Acme');
    expect(toDisplayText({ title: 'Keynote' })).toBe('Keynote');
    expect(toDisplayText({ label: 'Gold' })).toBe('Gold');
    expect(toDisplayText({ id: 3 })).toBe('');
  });
});

describe('joinParts', () => {
  it('pads a separator with single spaces', () => {
    expect(joinParts(['Ms', 'Jane', 'Doe'], '-')).toBe('Ms - Jane - Doe');
    expect(joinParts(['Ms', 'Jane'], ' - ')).toBe('Ms - Jane');
  });

  it('joins with one space for a space-only separator', () => {
    expect(joinParts(['Jane', 'Doe'], '   ')).toBe('Jane Doe');
  });
});

describe('parseFields', () => {
  it('reads one field per line', () => {
    expect(parseFields('firstName\n  lastName \n\nemail')).toEqual(['firstName', 'lastName', 'email']);
    expect(parseFields(undefined)).toEqual([]);
  });
});

describe('resolveFieldPath', () => {
  it('resolves siblings of a nested composite', () => {
    expect(resolveFieldPath('display', 'firstName')).toBe('firstName');
    expect(resolveFieldPath('contacts.0.display', 'firstName')).toBe('contacts.0.firstName');
  });
});

describe('compose', () => {
  const values = {
    salutation: 'Ms',
    firstName: 'Jane',
    lastName: '',
    company: { name: 'Acme' },
    contacts: [{ firstName: 'Bo', lastName: 'Le' }],
  };

  it('skips empty sources', () => {
    expect(compose(values, 'display', ['salutation', 'firstName', 'lastName', 'company'], ' - ')).toBe(
      'Ms - Jane - Acme'
    );
  });

  it('reads sibling fields inside components', () => {
    expect(compose(values, 'contacts.0.display', ['firstName', 'lastName'], ' ')).toBe('Bo Le');
  });

  it('returns an empty string when nothing is set', () => {
    expect(compose({}, 'display', ['firstName'], ' - ')).toBe('');
  });
});
