import { Box, Checkbox, DatePicker, Field, Flex, Grid, IconButton, Typography } from '@strapi/design-system';
import { Plus, Trash } from '@strapi/icons';
import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { styled } from 'styled-components';

import { getTranslation } from '../utils/getTranslation';
import {
  addDate,
  DEFAULT_AFTERNOON,
  DEFAULT_MORNING,
  formatDateLabel,
  isAllSelected,
  parseSchedule,
  parseSlotList,
  removeDate,
  serializeSchedule,
  toDateString,
  toggleAll,
  toggleSlot,
  type Schedule,
} from '../utils/slots';

const DateSection = styled(Box)`
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spaces[4]};
  background: transparent;
  width: 100%;
`;

const DateHeader = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spaces[4]};
  padding-bottom: ${({ theme }) => theme.spaces[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
`;

const SlotLabel = styled(Box)<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spaces[2]} ${({ theme }) => theme.spaces[3]};
  background: ${({ theme, $checked }) => ($checked ? theme.colors.primary100 : 'transparent')};
  border: 1px solid ${({ theme, $checked }) => ($checked ? theme.colors.primary600 : theme.colors.neutral200)};
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  transition: all 0.2s;
  min-height: 40px;
  gap: ${({ theme }) => theme.spaces[2]};

  &:hover {
    background: ${({ theme, $checked }) => ($checked ? theme.colors.primary200 : theme.colors.neutral150)};
    border-color: ${({ theme, $checked }) => ($checked ? theme.colors.primary600 : theme.colors.neutral300)};
  }
`;

interface SlotGroupProps {
  title: string;
  slots: string[];
  selected: string[];
  onToggle: (slot: string) => void;
}

const SlotGroup = ({ title, slots, selected, onToggle }: SlotGroupProps) => (
  <Flex direction="column" gap={1} alignItems="unset">
    <Typography variant="sigma" textColor="neutral800" fontWeight="semiBold" textAlign="center">
      {title}
    </Typography>
    {slots.map((slot) => {
      const checked = selected.includes(slot);
      return (
        <SlotLabel
          key={slot}
          $checked={checked}
          onClick={() => onToggle(slot)}
          onKeyDown={(event: React.KeyboardEvent) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onToggle(slot);
            }
          }}
          role="button"
          tabIndex={0}
          aria-pressed={checked}
        >
          {/* The row already toggles on click; stop the checkbox click from toggling twice. */}
          <Box tag="span" onClick={(event: React.MouseEvent) => event.stopPropagation()}>
            <Checkbox checked={checked} onCheckedChange={() => onToggle(slot)} aria-label={slot} />
          </Box>
          <Typography variant="omega">{slot}</Typography>
        </SlotLabel>
      );
    })}
  </Flex>
);

interface TimeSlotInputProps {
  name: string;
  value?: unknown;
  onChange: (event: { target: { name: string; value: string; type: string } }) => void;
  label?: string;
  intlLabel?: { id: string; defaultMessage: string };
  hint?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  attribute?: {
    options?: { morningSlots?: string; afternoonSlots?: string; allowDateEditing?: boolean };
  };
}

const sameSchedule = (a: Schedule, b: Schedule) => serializeSchedule(a) === serializeSchedule(b);

const TimeSlotInput = ({
  name,
  value,
  onChange,
  label,
  intlLabel,
  hint,
  required,
  error,
  disabled,
  attribute,
}: TimeSlotInputProps) => {
  const { formatMessage } = useIntl();
  const options = attribute?.options;

  const morning = useMemo(() => parseSlotList(options?.morningSlots, DEFAULT_MORNING), [options?.morningSlots]);
  const afternoon = useMemo(
    () => parseSlotList(options?.afternoonSlots, DEFAULT_AFTERNOON),
    [options?.afternoonSlots]
  );
  const allSlots = useMemo(() => [...morning, ...afternoon], [morning, afternoon]);
  const canEditDates = options?.allowDateEditing === true;

  const [schedule, setSchedule] = useState(() => parseSchedule(value));
  const [newDate, setNewDate] = useState<Date | undefined>();

  // Follow values set from outside (another entry loaded, form reset) so toggles start from them.
  useEffect(() => {
    const synced = parseSchedule(value);
    setSchedule((current) => (sameSchedule(current, synced) ? current : synced));
  }, [value]);

  const update = (next: Schedule) => {
    setSchedule(next);
    onChange({ target: { name, value: serializeSchedule(next), type: 'json' } });
  };

  const handleAddDate = () => {
    if (!newDate) return;
    update(addDate(schedule, toDateString(newDate)));
    setNewDate(undefined);
  };

  const t = (id: string, defaultMessage: string) => formatMessage({ id: getTranslation(id), defaultMessage });

  return (
    <Field.Root name={name} required={required} error={error} hint={hint}>
      <Field.Label>{label || (intlLabel?.id ? formatMessage(intlLabel) : name)}</Field.Label>

      {canEditDates && (
        <Flex gap={2} alignItems="flex-end" paddingTop={1} paddingBottom={4}>
          <Box style={{ flex: 1 }}>
            <DatePicker
              aria-label={t('date.add.placeholder', 'Select a date to add')}
              placeholder={t('date.add.placeholder', 'Select a date to add')}
              value={newDate}
              onChange={setNewDate}
              onClear={() => setNewDate(undefined)}
              clearLabel={t('date.clear', 'Clear')}
              disabled={disabled}
            />
          </Box>
          <IconButton onClick={handleAddDate} disabled={disabled || !newDate} label={t('date.add', 'Add date')} size="L">
            <Plus />
          </IconButton>
        </Flex>
      )}

      {schedule.dates.length === 0 && (
        <Box paddingTop={2} paddingBottom={4}>
          <Typography variant="omega" textColor="neutral500">
            {canEditDates
              ? t('empty.editable', 'No dates selected. Please add a date to select time slots.')
              : t('empty', 'No dates yet. Dates are added to this field through the API.')}
          </Typography>
        </Box>
      )}

      <Grid.Root gap={{ large: 5, medium: 2, initial: 1 }}>
        {schedule.dates.map((date) => {
          const selected = schedule.slots[date] || [];
          return (
            <Grid.Item key={date} col={6} s={12}>
              <DateSection>
                <DateHeader>
                  <Flex gap={2} alignItems="center">
                    <Checkbox
                      checked={isAllSelected(selected, allSlots)}
                      onCheckedChange={() => update({ ...schedule, slots: toggleAll(schedule.slots, date, allSlots) })}
                      aria-label={t('date.selectAll', 'Select all slots')}
                    />
                    <Typography fontWeight="bold">{formatDateLabel(date)}</Typography>
                  </Flex>
                  {canEditDates && (
                    <IconButton onClick={() => update(removeDate(schedule, date))} label={t('date.remove', 'Remove date')}>
                      <Trash />
                    </IconButton>
                  )}
                </DateHeader>

                <Flex direction="column" gap={3} alignItems="unset">
                  {[
                    { title: t('morning', 'MORNING'), slots: morning },
                    { title: t('afternoon', 'AFTERNOON'), slots: afternoon },
                  ].map((group) => (
                    <SlotGroup
                      key={group.title}
                      title={group.title}
                      slots={group.slots}
                      selected={selected}
                      onToggle={(slot) => update({ ...schedule, slots: toggleSlot(schedule.slots, date, slot) })}
                    />
                  ))}
                </Flex>
              </DateSection>
            </Grid.Item>
          );
        })}
      </Grid.Root>

      <Field.Hint />
      <Field.Error />
    </Field.Root>
  );
};

export default TimeSlotInput;
