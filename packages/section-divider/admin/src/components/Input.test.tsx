import { DesignSystemProvider } from '@strapi/design-system';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Input from './Input';

describe('Input', () => {
  it('renders the resolved label', () => {
    render(
      <DesignSystemProvider>
        <Input name="contact_divider" label="Contact details" />
      </DesignSystemProvider>
    );

    expect(screen.getByText('Contact details')).toBeTruthy();
  });
});
