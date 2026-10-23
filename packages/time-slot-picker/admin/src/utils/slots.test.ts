import { describe, expect, it } from 'vitest';

import {
  addDate,
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
} from './slots';

const stored = {
  days: [
    { date: '2026-06-18', slots: ['8:00-9:00', '9:00-10:00'] },
    { date: '2026-06-19', slots: [] },
  ],
};

describe('parseSlotList', () => {
  it('reads one slot per line', () => {
    expect(parseSlotList('7:00-8:00\n 8:00-9:00 \n', [])).toEqual(['7:00-8:00', '8:00-9:00']);
  });

  it('falls back to the defaults when empty', () => {
    expect(parseSlotList(undefined, DEFAULT_MORNING)).toBe(DEFAULT_MORNING);
    expect(parseSlotList('  ', DEFAULT_MORNING)).toBe(DEFAULT_MORNING);
  });
});

describe('parseSchedule', () => {
  it('reads an object or its JSON string', () => {
    const expected = {
      dates: ['2026-06-18', '2026-06-19'],
      slots: { '2026-06-18': ['8:00-9:00', '9:00-10:00'], '2026-06-19': [] },
    };
    expect(parseSchedule(stored)).toEqual(expected);
    expect(parseSchedule(JSON.stringify(stored))).toEqual(expected);
  });

  it('returns an empty schedule for missing or broken values', () => {
    expect(parseSchedule(null)).toEqual({ dates: [], slots: {} });
    expect(parseSchedule('{oops')).toEqual({ dates: [], slots: {} });
    expect(parseSchedule({ days: 'x' })).toEqual({ dates: [], slots: {} });
  });

  it('round-trips through serializeSchedule', () => {
    expect(JSON.parse(serializeSchedule(parseSchedule(stored)))).toEqual(stored);
  });
});

describe('toggleSlot', () => {
  it('adds and removes a slot for one date', () => {
    const once = toggleSlot({}, '2026-06-18', '8:00-9:00');
    expect(once).toEqual({ '2026-06-18': ['8:00-9:00'] });
    expect(toggleSlot(once, '2026-06-18', '8:00-9:00')).toEqual({ '2026-06-18': [] });
  });
});

describe('toggleAll', () => {
  const all = ['8:00-9:00', '9:00-10:00'];

  it('selects every slot, then clears them', () => {
    const selected = toggleAll({ d: ['8:00-9:00'] }, 'd', all);
    expect(selected.d).toEqual(all);
    expect(isAllSelected(selected.d, all)).toBe(true);
    expect(toggleAll(selected, 'd', all).d).toEqual([]);
  });

  it('never counts an empty slot list as all selected', () => {
    expect(isAllSelected([], [])).toBe(false);
  });
});

describe('addDate / removeDate', () => {
  it('adds a date once, in order, with no slots', () => {
    const schedule = addDate({ dates: ['2026-06-19'], slots: { '2026-06-19': ['x'] } }, '2026-06-18');
    expect(schedule.dates).toEqual(['2026-06-18', '2026-06-19']);
    expect(schedule.slots['2026-06-18']).toEqual([]);
    expect(addDate(schedule, '2026-06-18')).toBe(schedule);
  });

  it('removes a date and its slots', () => {
    expect(removeDate({ dates: ['a', 'b'], slots: { a: ['x'], b: [] } }, 'a')).toEqual({
      dates: ['b'],
      slots: { b: [] },
    });
  });
});

describe('dates', () => {
  it('uses the local calendar day', () => {
    expect(toDateString(new Date(2026, 5, 8, 23, 30))).toBe('2026-06-08');
  });

  it('formats a label, or returns the input when it is not a date', () => {
    expect(formatDateLabel('2026-06-18')).toBe('THU, JUN 18, 2026');
    expect(formatDateLabel('soon')).toBe('soon');
  });
});
