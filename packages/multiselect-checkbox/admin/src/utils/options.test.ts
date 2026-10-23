import { describe, expect, it } from 'vitest';

import { parseOptions, readSelected, toggleValue, validateSelection } from './options';

describe('parseOptions', () => {
  it('uses the line as both label and value', () => {
    expect(parseOptions(['Red', 'Green'])).toEqual([
      { label: 'Red', value: 'Red' },
      { label: 'Green', value: 'Green' },
    ]);
  });

  it('splits label:value on the first colon only', () => {
    expect(parseOptions(['Opening time:open:09'])).toEqual([{ label: 'Opening time', value: 'open:09' }]);
  });

  it('drops lines with an empty label or value', () => {
    expect(parseOptions([':x', 'y:', ''])).toEqual([]);
    expect(parseOptions(undefined)).toEqual([]);
  });
});

describe('readSelected', () => {
  const options = parseOptions(['Red', 'Green', 'Blue']);

  it('reads an array or its JSON string', () => {
    expect(readSelected(['Red', 'Blue'], options)).toEqual(['Red', 'Blue']);
    expect(readSelected('["Green"]', options)).toEqual(['Green']);
  });

  it('drops values that are no longer options', () => {
    expect(readSelected(['Red', 'Purple'], options)).toEqual(['Red']);
  });

  it('treats empty or broken values as nothing selected', () => {
    expect(readSelected(null, options)).toEqual([]);
    expect(readSelected('', options)).toEqual([]);
    expect(readSelected('{bad', options)).toEqual([]);
    expect(readSelected('"Red"', options)).toEqual([]);
  });
});

describe('toggleValue', () => {
  it('adds once and removes', () => {
    expect(toggleValue(['Red'], 'Blue', true)).toEqual(['Red', 'Blue']);
    expect(toggleValue(['Red'], 'Red', true)).toEqual(['Red']);
    expect(toggleValue(['Red', 'Blue'], 'Red', false)).toEqual(['Blue']);
  });
});

describe('validateSelection', () => {
  it('flags a required field without options', () => {
    expect(validateSelection({ count: 0, optionCount: 0, required: true })).toEqual({ id: 'error.no-options' });
  });

  it('applies min only when required or something is selected', () => {
    expect(validateSelection({ count: 0, optionCount: 3, min: 2 })).toBeNull();
    expect(validateSelection({ count: 1, optionCount: 3, min: 2 })).toEqual({ id: 'error.min', min: 2 });
    expect(validateSelection({ count: 0, optionCount: 3, min: 2, required: true })).toEqual({
      id: 'error.min',
      min: 2,
    });
  });

  it('applies max', () => {
    expect(validateSelection({ count: 3, optionCount: 3, max: 2 })).toEqual({ id: 'error.max', max: 2 });
    expect(validateSelection({ count: 2, optionCount: 3, max: 2 })).toBeNull();
  });
});
