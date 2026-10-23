import { describe, expect, it } from 'vitest';

import { filterOptions, parseInitialOptions, withValue } from './options';

describe('parseInitialOptions', () => {
  it('splits newline-separated text and drops blank lines', () => {
    expect(parseInitialOptions('Red\n  Green \n\nBlue')).toEqual(['Red', 'Green', 'Blue']);
  });

  it('reads a JSON array string', () => {
    expect(parseInitialOptions('["Red","Green"]')).toEqual(['Red', 'Green']);
  });

  it('treats JSON that is not an array as text', () => {
    expect(parseInitialOptions('42')).toEqual(['42']);
    expect(parseInitialOptions('"Red"')).toEqual(['"Red"']);
  });

  it('accepts arrays with non-string items', () => {
    expect(parseInitialOptions([1, 'Two', true])).toEqual(['1', 'Two', 'true']);
    expect(parseInitialOptions('[1, 2]')).toEqual(['1', '2']);
  });

  it('returns an empty list for anything else', () => {
    expect(parseInitialOptions(undefined)).toEqual([]);
    expect(parseInitialOptions({ enum: ['Red'] })).toEqual([]);
  });
});

describe('withValue', () => {
  it('appends a saved value missing from the list', () => {
    expect(withValue(['Red'], 'Purple')).toEqual(['Red', 'Purple']);
  });

  it('leaves the list alone for known or empty values', () => {
    const options = ['Red'];
    expect(withValue(options, 'Red')).toBe(options);
    expect(withValue(options, '')).toBe(options);
    expect(withValue(options, null)).toBe(options);
  });
});

describe('filterOptions', () => {
  it('matches case-insensitively anywhere in the option', () => {
    expect(filterOptions(['Dark Red', 'Green', 'red wine'], 'RED')).toEqual(['Dark Red', 'red wine']);
  });

  it('returns everything for an empty search', () => {
    expect(filterOptions(['Red', 'Green'], '')).toEqual(['Red', 'Green']);
  });
});
