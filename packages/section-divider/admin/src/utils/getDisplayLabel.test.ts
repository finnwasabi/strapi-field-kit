import { describe, expect, it } from 'vitest';

import { getDisplayLabel } from './getDisplayLabel';

describe('getDisplayLabel', () => {
  it('prefers the label prop', () => {
    expect(
      getDisplayLabel({
        name: 'divider',
        label: 'Contact details',
        intlLabel: { id: 'x', defaultMessage: 'From intl' },
      })
    ).toBe('Contact details');
  });

  it('falls back to intlLabel.defaultMessage, then intlLabel.id', () => {
    expect(getDisplayLabel({ name: 'divider', intlLabel: { id: 'x', defaultMessage: 'Intl' } })).toBe(
      'Intl'
    );
    expect(getDisplayLabel({ name: 'divider', intlLabel: { id: 'section.id' } })).toBe('section.id');
  });

  it('falls back to attribute.label, then the field name', () => {
    expect(getDisplayLabel({ name: 'divider', attribute: { label: 'Attr' } })).toBe('Attr');
    expect(getDisplayLabel({ name: 'divider' })).toBe('divider');
  });

  it('skips empty strings', () => {
    expect(getDisplayLabel({ name: 'divider', label: '', attribute: { label: 'Attr' } })).toBe('Attr');
  });
});
