import { Box, Checkbox, Field, Flex, Typography } from '@strapi/design-system';
import { useField } from '@strapi/strapi/admin';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { styled } from 'styled-components';

import { parseOptions, readSelected, toggleValue, validateSelection } from '../../utils/options';
import { prefixKey } from '../../utils/prefixKey';

const CapitalizedText = styled.p`
  &::first-letter {
    text-transform: uppercase;
  }
`;

const OptionsGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spaces[2]};
`;

interface MultiSelectProps {
  name: string;
  label?: string;
  hint?: string;
  intlLabel?: { id: string; defaultMessage: string };
  description?: { id: string; defaultMessage: string };
  required?: boolean;
  disabled?: boolean;
  attribute: { type: string; options?: unknown; min?: number; max?: number };
}

const MultiSelect = ({ hint, label, name, intlLabel, required, attribute, description, disabled }: MultiSelectProps) => {
  const { formatMessage } = useIntl();
  const { onChange, value, error } = useField(name);

  const options = useMemo(() => parseOptions(attribute.options), [attribute.options]);
  const selected = useMemo(() => readSelected(value, options), [value, options]);

  const selectionError = validateSelection({
    count: selected.length,
    optionCount: options.length,
    required,
    min: attribute.min,
    max: attribute.max,
  });

  const fieldError =
    error ||
    (selectionError
      ? formatMessage(
          {
            id: prefixKey(selectionError.id),
            defaultMessage: {
              'error.no-options': 'No options, but field is required',
              'error.min': 'Select at least {min} options',
              'error.max': 'Select at most {max} options',
            }[selectionError.id],
          },
          selectionError
        )
      : undefined);

  const handleChange = (optionValue: string, checked: boolean) => {
    const next = toggleValue(selected, optionValue, checked);
    // Kept as a JSON string, as in 1.x, so existing data and API consumers see the same shape.
    onChange(name, next.length ? JSON.stringify(next) : null);
  };

  return (
    <Field.Root
      hint={description?.id ? formatMessage(description) : hint}
      error={fieldError}
      name={name}
      required={required}
    >
      <Flex direction="column" alignItems="stretch" gap={1}>
        <Field.Label>{intlLabel?.id ? formatMessage(intlLabel) : label}</Field.Label>

        {options.length === 0 ? (
          <Typography variant="pi" textColor="neutral400">
            {formatMessage({
              id: prefixKey('empty-state'),
              defaultMessage: 'No options available. Please configure options in the field settings.',
            })}
          </Typography>
        ) : (
          <Box padding={2}>
            <OptionsGrid>
              {options.map((option) => {
                const checked = selected.includes(option.value);
                const atMax = attribute.max !== undefined && selected.length >= attribute.max;
                return (
                  <Checkbox
                    key={option.value}
                    checked={checked}
                    disabled={disabled || (atMax && !checked)}
                    onCheckedChange={(next: boolean) => handleChange(option.value, next)}
                  >
                    <CapitalizedText>
                      {formatMessage({ id: option.label, defaultMessage: option.label })}
                    </CapitalizedText>
                  </Checkbox>
                );
              })}
            </OptionsGrid>
          </Box>
        )}

        <Field.Hint />
        <Field.Error />
      </Flex>
    </Field.Root>
  );
};

export default MultiSelect;
