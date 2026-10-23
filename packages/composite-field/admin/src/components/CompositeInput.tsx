import { Button, Field, Flex } from '@strapi/design-system';
import { Play } from '@strapi/icons';
import { unstable_useContentManagerContext as useContentManagerContext } from '@strapi/strapi/admin';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useIntl } from 'react-intl';

import { compose, parseFields, readSourceValues } from '../utils/compose';
import { getTranslation } from '../utils/getTranslation';

interface CompositeInputProps {
  name: string;
  value?: string | null;
  onChange?: (event: { target: { name: string; value: string; type: string } }) => void;
  attribute?: { options?: { fields?: unknown; separator?: string; autoGenerate?: boolean } };
  disabled?: boolean;
  required?: boolean;
  error?: string;
  description?: { id: string; defaultMessage: string } | string;
  labelAction?: ReactNode;
  label?: string;
  intlLabel?: { id: string; defaultMessage: string };
}

const CompositeInput = ({
  name,
  value,
  onChange,
  attribute,
  disabled,
  required,
  error,
  description,
  labelAction,
  label,
  intlLabel,
}: CompositeInputProps) => {
  const { formatMessage } = useIntl();
  const { form } = useContentManagerContext() as { form: { values: unknown } };
  const values = form.values;

  const [localValue, setLocalValue] = useState(value || '');
  const [isManuallyEdited, setIsManuallyEdited] = useState(false);

  const lastGenerated = useRef(value || '');
  // Source values the field was last generated from; null until the form has loaded.
  const lastWatched = useRef<string | null>(null);

  useEffect(() => {
    const next = value || '';
    // A value this field did not produce (another entry loaded, form reset) is a new baseline.
    if (next !== lastGenerated.current) lastWatched.current = null;
    setLocalValue(next);
    lastGenerated.current = next;
    setIsManuallyEdited(false);
  }, [value]);

  const fields = useMemo(() => parseFields(attribute?.options?.fields), [attribute?.options?.fields]);
  const separator = attribute?.options?.separator || ' - ';
  const autoGenerate = attribute?.options?.autoGenerate === true;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setLocalValue(next);
    lastGenerated.current = next;
    setIsManuallyEdited(true);
    onChange?.({ target: { name, value: next, type: 'text' } });
  };

  const handleGenerate = useCallback(() => {
    const result = compose(values, name, fields, separator);
    if (result === lastGenerated.current) return;

    setLocalValue(result);
    lastGenerated.current = result;
    setIsManuallyEdited(false);
    onChange?.({ target: { name, value: result, type: 'text' } });
  }, [values, name, fields, separator, onChange]);

  const watched = useMemo(
    () => JSON.stringify(readSourceValues(values, name, fields)),
    [values, name, fields]
  );

  useEffect(() => {
    if (!autoGenerate || fields.length === 0) return;

    // Keep the saved value when an entry opens: regenerating it there marks the form as
    // modified and overwrites values written by the server on the next save.
    if (lastWatched.current === null) {
      lastWatched.current = watched;
      return;
    }

    if (watched === lastWatched.current) return;
    lastWatched.current = watched;

    if (isManuallyEdited) {
      // A source change ends the manual edit, so the next change regenerates again.
      setIsManuallyEdited(false);
      return;
    }

    const timeoutId = setTimeout(handleGenerate, 300);
    return () => clearTimeout(timeoutId);
  }, [autoGenerate, fields, handleGenerate, watched, isManuallyEdited]);

  const describedHint =
    typeof description === 'object' && description?.id ? formatMessage(description) : description;
  // Field.Hint only renders the hint passed to Field.Root, so the field list goes there
  // unless the editor wrote a description for this field.
  const combines =
    fields.length > 0
      ? formatMessage(
          autoGenerate
            ? { id: getTranslation('combines.auto'), defaultMessage: 'Combines: {fields} (auto-generated)' }
            : { id: getTranslation('combines'), defaultMessage: 'Combines: {fields}' },
          { fields: fields.join(', ') }
        )
      : undefined;
  const hint = (describedHint as string | undefined) || combines;

  return (
    <Field.Root name={name} id={name} error={error} hint={hint} required={required}>
      <Flex direction="column" alignItems="stretch" gap={1}>
        <Field.Label action={labelAction}>{label || intlLabel?.defaultMessage || name}</Field.Label>

        <div style={{ position: 'relative' }}>
          <Field.Input
            type="text"
            value={localValue}
            onChange={handleChange}
            disabled={disabled}
            placeholder={
              autoGenerate
                ? formatMessage({
                    id: getTranslation('placeholder.auto'),
                    defaultMessage: 'Auto-generated from fields',
                  })
                : formatMessage({
                    id: getTranslation('placeholder.manual'),
                    defaultMessage: 'Click button to generate',
                  })
            }
            style={{ paddingRight: '40px' }}
          />
          {!autoGenerate && (
            <div
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Button
                type="button"
                onClick={handleGenerate}
                disabled={disabled || fields.length === 0}
                variant="tertiary"
                aria-label={formatMessage({
                  id: getTranslation('generate'),
                  defaultMessage: 'Generate composite value',
                })}
                style={{
                  width: '28px',
                  height: '28px',
                  padding: 0,
                  minWidth: 'auto',
                  border: 'none',
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#8e8ea9',
                }}
              >
                <Play style={{ width: '14px', height: '14px' }} />
              </Button>
            </div>
          )}
        </div>

        <Field.Hint />
        <Field.Error />
      </Flex>
    </Field.Root>
  );
};

export default CompositeInput;
