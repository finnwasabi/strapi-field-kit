export const DEFAULT_MORNING = ['8:00-9:00', '9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00'];
export const DEFAULT_AFTERNOON = ['13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'];

export type DateSlots = Record<string, string[]>;

export interface Schedule {
  dates: string[];
  slots: DateSlots;
}

export const parseSlotList = (config: unknown, fallback: string[]): string[] => {
  if (typeof config !== 'string' || !config.trim()) return fallback;
  return config
    .split('\n')
    .map((slot) => slot.trim())
    .filter(Boolean);
};

// Stored shape: { "days": [{ "date": "2026-06-18", "slots": ["8:00-9:00"] }] },
// either as an object or as its JSON string.
export const parseSchedule = (value: unknown): Schedule => {
  const empty: Schedule = { dates: [], slots: {} };
  if (!value) return empty;

  let parsed: unknown = value;
  if (typeof value === 'string') {
    try {
      parsed = JSON.parse(value);
    } catch {
      return empty;
    }
  }

  const days = (parsed as { days?: unknown })?.days;
  if (!Array.isArray(days)) return empty;

  return days.reduce<Schedule>(
    (schedule, day) => {
      if (typeof day?.date !== 'string') return schedule;
      schedule.dates.push(day.date);
      schedule.slots[day.date] = Array.isArray(day.slots) ? day.slots.map(String) : [];
      return schedule;
    },
    { dates: [], slots: {} }
  );
};

export const serializeSchedule = ({ dates, slots }: Schedule): string =>
  JSON.stringify({ days: dates.map((date) => ({ date, slots: slots[date] || [] })) });

export const toggleSlot = (slots: DateSlots, date: string, slot: string): DateSlots => {
  const current = slots[date] || [];
  return {
    ...slots,
    [date]: current.includes(slot) ? current.filter((s) => s !== slot) : [...current, slot],
  };
};

export const isAllSelected = (selected: string[] = [], all: string[]): boolean =>
  all.length > 0 && all.every((slot) => selected.includes(slot));

export const toggleAll = (slots: DateSlots, date: string, all: string[]): DateSlots => ({
  ...slots,
  [date]: isAllSelected(slots[date], all) ? [] : [...all],
});

export const addDate = (schedule: Schedule, date: string): Schedule =>
  schedule.dates.includes(date)
    ? schedule
    : {
        dates: [...schedule.dates, date].sort(),
        slots: { ...schedule.slots, [date]: [] },
      };

export const removeDate = (schedule: Schedule, date: string): Schedule => {
  const { [date]: _removed, ...slots } = schedule.slots;
  return { dates: schedule.dates.filter((d) => d !== date), slots };
};

// The picker hands back a local Date; use its local calendar day, not the UTC one.
export const toDateString = (date: Date): string =>
  [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join(
    '-'
  );

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export const formatDateLabel = (dateString: string): string => {
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return `${DAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};
