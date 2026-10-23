import { Combobox, ComboboxOption, Field } from '@strapi/design-system';
import { useNotification } from '@strapi/strapi/admin';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { filterOptions, parseInitialOptions, withValue } from '../utils/options';
import { getTranslation } from '../utils/getTranslation';

interface DynamicEnumInputProps {
  name: string;
  value?: string | null;
  onChange: (event: { target: { name: string; value: string; type: string } }) => void;
  label?: string;
  intlLabel?: { id: string; defaultMessage: string };
  hint?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  attribute?: { options?: unknown };
}

const getInitialOptions = (attribute: DynamicEnumInputProps['attribute']) => {
  const options = attribute?.options as { enum?: unknown } | string | undefined;
  // Older schemas kept the list under options.enum.
  return parseInitialOptions(
    typeof options === 'object' && options !== null && 'enum' in options ? options.enum : options
  );
};

const DynamicEnumInput = ({
  name,
  value,
  onChange,
  label,
  intlLabel,
  hint,
  required,
  error,
  disabled = false,
  attribute,
}: DynamicEnumInputProps) => {
  const { formatMessage } = useIntl();
  const { toggleNotification } = useNotification();

  const [options, setOptions] = useState(() => withValue(getInitialOptions(attribute), value));
  const [search, setSearch] = useState('');

  // A saved value can arrive after the first render, once the entry has loaded.
  useEffect(() => {
    setOptions((current) => withValue(current, value));
  }, [value]);

  const select = (next: string) => {
    onChange({ target: { name, value: next, type: 'string' } });
    setSearch('');
  };

  const handleCreateOption = (created?: string) => {
    const trimmed = String(created ?? '').trim();
    if (!trimmed) return;

    if (!options.includes(trimmed)) {
      setOptions((current) => [...current, trimmed]);
      toggleNotification({
        type: 'success',
        message: formatMessage(
          { id: getTranslation('notification.created'), defaultMessage: 'Created and selected "{value}"' },
          { value: trimmed }
        ),
      });
    }

    select(trimmed);
  };

  return (
    <Field.Root name={name} required={required} error={error} hint={hint}>
      <Field.Label>{label || (intlLabel?.id ? formatMessage(intlLabel) : name)}</Field.Label>
      <Combobox
        value={value || ''}
        onChange={(selected?: string) => select(selected ?? '')}
        onInputChange={(input: string | React.ChangeEvent<HTMLInputElement>) =>
          setSearch(typeof input === 'string' ? input : input.target.value)
        }
        placeholder={formatMessage({
          id: getTranslation('placeholder'),
          defaultMessage: 'Select or type to create',
        })}
        disabled={disabled}
        creatable
        onCreateOption={handleCreateOption}
      >
        {filterOptions(options, search).map((option) => (
          <ComboboxOption key={option} value={option}>
            {option}
          </ComboboxOption>
        ))}
      </Combobox>
      <Field.Hint />
      <Field.Error />
    </Field.Root>
  );
};

export default DynamicEnumInput;
