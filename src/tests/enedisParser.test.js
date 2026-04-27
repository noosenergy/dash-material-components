'use strict';

const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

// Side-effect import: registers window.DashCsvParsers['enedis'] in the jsdom environment
require('../parsers/enedis');
const parse = window.DashCsvParsers['enedis'];

// ── Builders ──────────────────────────────────────────────────────────────────

function buildSimple(timestamps, values = [0, 0, 0]) {
  const fields = ['delivery_from', 'load_value'];
  const rows = timestamps.map((ts, i) => ({delivery_from: ts, load_value: values[i]}));
  return {rows, fields};
}

function buildM021(timestamps, values = [0, 0, 0]) {
  // 3 fields required: the 2-field check dispatches to Simple, not M021
  const fields = ['Identifiant PRM', 'Valeur Brute', 'Pas en minutes'];
  const rows = [
    {'Identifiant PRM': '12345', 'Valeur Brute': '', 'Pas en minutes': ''}, // metadata
    {'Identifiant PRM': 'Horodate', 'Valeur Brute': 'Valeur', 'Pas en minutes': ''}, // sub-header
    ...timestamps.map((ts, i) => ({
      'Identifiant PRM': ts,
      'Valeur Brute': values[i],
      'Pas en minutes': '',
    })),
  ];
  return {rows, fields};
}

function buildM022(entries, values = [0, 0, 0]) {
  // entries: [{date: 'DD/MM/YYYY', time: 'HH:MM:SS'}, ...]
  const fields = ['Date de la mesure', 'Heure de la mesure', 'Valeur', 'PRM'];
  const rows = entries.map(({date, time}, i) => ({
    'Date de la mesure': date,
    'Heure de la mesure': time,
    Valeur: values[i],
    PRM: i === 0 ? '1234' : '',
  }));
  return {rows, fields};
}

function buildM023(timestamps, values = [0, 0, 0]) {
  // timestamps: 'YYYY-MM-DD HH:MM:SS', naive Europe/Paris
  const fields = ['Identifiant PRM', 'Horodate', 'Valeur', 'Unité'];
  const rows = timestamps.map((ts, i) => ({
    'Identifiant PRM': '123456',
    Horodate: ts,
    Valeur: values[i],
    Unité: 'W',
  }));
  return {rows, fields};
}

// ── Shared fixtures ───────────────────────────────────────────────────────────

// tz-aware timestamps for Simple / M021
const UTC_TS = ['2025-01-01T00:00:00Z', '2025-01-01T01:00:00Z', '2025-01-01T02:00:00Z'];
const CET_TS = ['2025-01-01T01:00:00+01:00', '2025-01-01T02:00:00+01:00', '2025-01-01T03:00:00+01:00'];
const CEST_TS = ['2025-07-01T02:00:00+02:00', '2025-07-01T03:00:00+02:00', '2025-07-01T04:00:00+02:00'];
const NAIVE_TS = ['2025-01-01 00:00:00', '2025-01-01 01:00:00', '2025-01-01 02:00:00'];

const UTC_3H = ['2025-01-01T00:00:00.000Z', '2025-01-01T01:00:00.000Z', '2025-01-01T02:00:00.000Z'];
const UTCSUMMER_3H = ['2025-07-01T00:00:00.000Z', '2025-07-01T01:00:00.000Z', '2025-07-01T02:00:00.000Z'];

// French date/time entries (naive Paris CET, UTC+1 in winter)
const M022_WINTER = [
  {date: '01/01/2025', time: '00:00:00'}, // UTC+1 → 2024-12-31T23:00:00.000Z
  {date: '01/01/2025', time: '01:00:00'}, //       → 2025-01-01T00:00:00.000Z
  {date: '01/01/2025', time: '02:00:00'}, //       → 2025-01-01T01:00:00.000Z
];
// French date/time entries (naive Paris CEST, UTC+2 in summer)
const M022_SUMMER = [
  {date: '01/07/2025', time: '02:00:00'}, // UTC+2 → 2025-07-01T00:00:00.000Z
  {date: '01/07/2025', time: '03:00:00'}, //       → 2025-07-01T01:00:00.000Z
  {date: '01/07/2025', time: '04:00:00'}, //       → 2025-07-01T02:00:00.000Z
];

// Naive Paris timestamps for M023 (YYYY-MM-DD HH:MM:SS)
const M023_WINTER = ['2025-01-01 00:00:00', '2025-01-01 01:00:00', '2025-01-01 02:00:00'];
const M023_SUMMER = ['2025-07-01 02:00:00', '2025-07-01 03:00:00', '2025-07-01 04:00:00'];

// ── Dispatch ──────────────────────────────────────────────────────────────────

describe('dispatch', () => {
  test('2 columns → Simple', () => {
    const {rows, fields} = buildSimple(UTC_TS);
    expect(parse(rows, fields).success).toBe(true);
  });

  test("column 'PRM' → M022", () => {
    const {rows, fields} = buildM022(M022_WINTER);
    expect(parse(rows, fields).success).toBe(true);
  });

  test("columns 'Horodate' + 'Valeur' → M023", () => {
    const {rows, fields} = buildM023(M023_WINTER);
    expect(parse(rows, fields).success).toBe(true);
  });

  test("column 'Identifiant PRM' only → M021", () => {
    const {rows, fields} = buildM021(UTC_TS);
    expect(parse(rows, fields).success).toBe(true);
  });

  test('unknown format → error with descriptive message', () => {
    const result = parse([{foo: 1}], ['foo', 'bar', 'baz']);
    expect(result.success).toBe(false);
    expect(result.errorMessage).toMatch(/Incorrect file format/);
  });
});

// ── Simple ────────────────────────────────────────────────────────────────────

describe('Simple', () => {
  test('meterpoint_id is "0", only set on first row', () => {
    const {rows, fields} = buildSimple(UTC_TS);
    const data = parse(rows, fields).data;
    expect(data[0].meterpoint_id).toBe('0');
    expect(data[1].meterpoint_id).toBe(null);
  });

  test('UTC timestamps → preserved as UTC', () => {
    const {rows, fields} = buildSimple(UTC_TS);
    expect(parse(rows, fields).data.map((r) => r.delivery_from)).toEqual(UTC_3H);
  });

  test('Paris CET (+01:00) timestamps → converted to UTC', () => {
    const {rows, fields} = buildSimple(CET_TS);
    expect(parse(rows, fields).data.map((r) => r.delivery_from)).toEqual(UTC_3H);
  });

  test('Paris CEST (+02:00) timestamps → converted to UTC', () => {
    const {rows, fields} = buildSimple(CEST_TS);
    expect(parse(rows, fields).data.map((r) => r.delivery_from)).toEqual(UTCSUMMER_3H);
  });

  test('naive (tz-unaware) timestamps → error', () => {
    const {rows, fields} = buildSimple(NAIVE_TS);
    const result = parse(rows, fields);
    expect(result.success).toBe(false);
    expect(result.errorMessage).toMatch(/Index must be timezone aware/);
  });

  test('duplicated timestamps → error', () => {
    const {rows, fields} = buildSimple([
      '2025-01-01T00:00:00Z',
      '2025-01-01T00:00:00Z',
      '2025-01-01T01:00:00Z',
    ]);
    const result = parse(rows, fields);
    expect(result.success).toBe(false);
    expect(result.errorMessage).toMatch(/Duplicated index entries/);
  });

  for (const [label, values, expected] of [
    ['integers', [1, 2, 3], [1, 2, 3]],
    ['negative integers', [1, -2, 3], [1, -2, 3]],
    ['floats', [1.5, 2.5, -3.5], [1.5, 2.5, -3.5]],
  ]) {
    test(`values: ${label} (no unit conversion, already MW)`, () => {
      const {rows, fields} = buildSimple(UTC_TS, values);
      expect(parse(rows, fields).data.map((r) => r.load_value)).toEqual(expected);
    });
  }

  for (const [label, values, errPattern] of [
    ['null value', [1, null, 3], /Null values detected/],
    ['empty string', [1, '', 3], /Null values detected/],
    ['non-numeric string', ['1', 'string', '3'], /Invalid numeric value/],
    ['"null" string', ['1', 'null', '3'], /Invalid numeric value/],
  ]) {
    test(`invalid values: ${label} → error`, () => {
      const {rows, fields} = buildSimple(UTC_TS, values);
      const result = parse(rows, fields);
      expect(result.success).toBe(false);
      expect(result.errorMessage).toMatch(errPattern);
    });
  }
});

// ── M021 ──────────────────────────────────────────────────────────────────────

describe('M021', () => {
  test('meterpoint_id extracted from header row', () => {
    const {rows, fields} = buildM021(UTC_TS);
    expect(parse(rows, fields).data[0].meterpoint_id).toBe('12345');
  });

  test('UTC timestamps → preserved as UTC', () => {
    const {rows, fields} = buildM021(UTC_TS);
    expect(parse(rows, fields).data.map((r) => r.delivery_from)).toEqual(UTC_3H);
  });

  test('Paris CET (+01:00) timestamps → converted to UTC', () => {
    const {rows, fields} = buildM021(CET_TS);
    expect(parse(rows, fields).data.map((r) => r.delivery_from)).toEqual(UTC_3H);
  });

  test('Paris CEST (+02:00) timestamps → converted to UTC', () => {
    const {rows, fields} = buildM021(CEST_TS);
    expect(parse(rows, fields).data.map((r) => r.delivery_from)).toEqual(UTCSUMMER_3H);
  });

  test('naive (tz-unaware) timestamps → error', () => {
    const {rows, fields} = buildM021(NAIVE_TS);
    const result = parse(rows, fields);
    expect(result.success).toBe(false);
    expect(result.errorMessage).toMatch(/Index must be timezone aware/);
  });

  test('duplicated timestamps → error', () => {
    const {rows, fields} = buildM021([
      '2025-01-01T00:00:00Z',
      '2025-01-01T00:00:00Z',
      '2025-01-01T01:00:00Z',
    ]);
    const result = parse(rows, fields);
    expect(result.success).toBe(false);
    expect(result.errorMessage).toMatch(/Duplicated index entries/);
  });

  for (const [label, values, expected] of [
    ['integers', [1e6, 2e6, 3e6], [1, 2, 3]],
    ['negative', [1e6, -2e6, 3e6], [1, -2, 3]],
    ['floats', [1e6, 2.5e6, -3.5e6], [1, 2.5, -3.5]],
  ]) {
    test(`values W→MW: ${label}`, () => {
      const {rows, fields} = buildM021(UTC_TS, values);
      expect(parse(rows, fields).data.map((r) => r.load_value)).toEqual(expected);
    });
  }

  for (const [label, values, errPattern] of [
    ['null value', [1, null, 3], /Null values detected/],
    ['empty string', [1, '', 3], /Null values detected/],
    ['non-numeric string', ['1', 'string', '3'], /Invalid numeric value/],
    ['"null" string', ['1', 'null', '3'], /Invalid numeric value/],
  ]) {
    test(`invalid values: ${label} → error`, () => {
      const {rows, fields} = buildM021(UTC_TS, values);
      const result = parse(rows, fields);
      expect(result.success).toBe(false);
      expect(result.errorMessage).toMatch(errPattern);
    });
  }
});

// ── M022 ──────────────────────────────────────────────────────────────────────

describe('M022', () => {
  test('meterpoint_id extracted from first row PRM column', () => {
    const {rows, fields} = buildM022(M022_WINTER);
    expect(parse(rows, fields).data[0].meterpoint_id).toBe('1234');
  });

  test('naive Paris CET → UTC (winter, UTC+1)', () => {
    const {rows, fields} = buildM022(M022_WINTER);
    expect(parse(rows, fields).data.map((r) => r.delivery_from)).toEqual([
      '2024-12-31T23:00:00.000Z',
      '2025-01-01T00:00:00.000Z',
      '2025-01-01T01:00:00.000Z',
    ]);
  });

  test('naive Paris CEST → UTC (summer, UTC+2)', () => {
    const {rows, fields} = buildM022(M022_SUMMER);
    expect(parse(rows, fields).data.map((r) => r.delivery_from)).toEqual([
      '2025-07-01T00:00:00.000Z',
      '2025-07-01T01:00:00.000Z',
      '2025-07-01T02:00:00.000Z',
    ]);
  });

  test('spring-forward gap: 02:30 does not exist → error', () => {
    // On 2025-03-30, clocks jump from 02:00 to 03:00 — 02:30 is non-existent
    const entries = [
      {date: '30/03/2025', time: '01:30:00'},
      {date: '30/03/2025', time: '02:30:00'},
      {date: '30/03/2025', time: '03:30:00'},
    ];
    const {rows, fields} = buildM022(entries);
    const result = parse(rows, fields);
    expect(result.success).toBe(false);
    expect(result.errorMessage).toMatch(/Non-existent local time/);
  });

  test('fall-back ambiguous hour resolved to post-transition (CET, UTC+1)', () => {
    // On 2025-10-26, clocks fall back from 03:00 CEST to 02:00 CET — 02:30 is ambiguous
    const entries = [
      {date: '26/10/2025', time: '01:30:00'}, // CEST (UTC+2) → 2025-10-25T23:30:00.000Z
      {date: '26/10/2025', time: '02:30:00'}, // ambiguous → resolved to CET (UTC+1) → 2025-10-26T01:30:00.000Z
      {date: '26/10/2025', time: '03:30:00'}, // CET  (UTC+1) → 2025-10-26T02:30:00.000Z
    ];
    const {rows, fields} = buildM022(entries);
    const result = parse(rows, fields);
    expect(result.success).toBe(true);
    expect(result.data.map((r) => r.delivery_from)).toEqual([
      '2025-10-25T23:30:00.000Z',
      '2025-10-26T01:30:00.000Z',
      '2025-10-26T02:30:00.000Z',
    ]);
  });

  test('duplicated timestamps → error', () => {
    const entries = [
      {date: '01/01/2025', time: '00:00:00'},
      {date: '01/01/2025', time: '00:00:00'},
      {date: '01/01/2025', time: '01:00:00'},
    ];
    const {rows, fields} = buildM022(entries);
    const result = parse(rows, fields);
    expect(result.success).toBe(false);
    expect(result.errorMessage).toMatch(/Duplicated index entries/);
  });

  for (const [label, values, expected] of [
    ['integers', [1e6, 2e6, 3e6], [1, 2, 3]],
    ['negative', [1e6, -2e6, 3e6], [1, -2, 3]],
    ['floats', [1e6, 2.5e6, -3.5e6], [1, 2.5, -3.5]],
  ]) {
    test(`values W→MW: ${label}`, () => {
      const {rows, fields} = buildM022(M022_WINTER, values);
      expect(parse(rows, fields).data.map((r) => r.load_value)).toEqual(expected);
    });
  }

  for (const [label, values, errPattern] of [
    ['null value', [1, null, 3], /Null values detected/],
    ['empty string', [1, '', 3], /Null values detected/],
    ['non-numeric string', ['1', 'string', '3'], /Invalid numeric value/],
    ['"null" string', ['1', 'null', '3'], /Invalid numeric value/],
  ]) {
    test(`invalid values: ${label} → error`, () => {
      const {rows, fields} = buildM022(M022_WINTER, values);
      const result = parse(rows, fields);
      expect(result.success).toBe(false);
      expect(result.errorMessage).toMatch(errPattern);
    });
  }
});

// ── M023 ──────────────────────────────────────────────────────────────────────

describe('M023', () => {
  test('meterpoint_id extracted from first row', () => {
    const {rows, fields} = buildM023(M023_WINTER);
    expect(parse(rows, fields).data[0].meterpoint_id).toBe('123456');
  });

  test('naive Paris CET → UTC (winter, UTC+1)', () => {
    const {rows, fields} = buildM023(M023_WINTER);
    expect(parse(rows, fields).data.map((r) => r.delivery_from)).toEqual([
      '2024-12-31T23:00:00.000Z',
      '2025-01-01T00:00:00.000Z',
      '2025-01-01T01:00:00.000Z',
    ]);
  });

  test('naive Paris CEST → UTC (summer, UTC+2)', () => {
    const {rows, fields} = buildM023(M023_SUMMER);
    expect(parse(rows, fields).data.map((r) => r.delivery_from)).toEqual([
      '2025-07-01T00:00:00.000Z',
      '2025-07-01T01:00:00.000Z',
      '2025-07-01T02:00:00.000Z',
    ]);
  });

  test('VAr rows filtered out — only W rows kept', () => {
    const fields = ['Identifiant PRM', 'Horodate', 'Valeur', 'Unité'];
    const rows = [
      {'Identifiant PRM': '123456', Horodate: '2025-01-01 01:00:00', Valeur: 1e6, Unité: 'W'},
      {'Identifiant PRM': '123456', Horodate: '2025-01-01 01:00:00', Valeur: 500, Unité: 'VAr'},
      {'Identifiant PRM': '123456', Horodate: '2025-01-01 02:00:00', Valeur: 2e6, Unité: 'W'},
      {'Identifiant PRM': '123456', Horodate: '2025-01-01 02:00:00', Valeur: 300, Unité: 'VAr'},
    ];
    const result = parse(rows, fields);
    expect(result.success).toBe(true);
    expect(result.data.length).toBe(2);
    expect(result.data.map((r) => r.load_value)).toEqual([1, 2]);
  });

  test('spring-forward gap: 02:30 does not exist → error', () => {
    // On 2025-03-30, clocks jump from 02:00 to 03:00 — 02:30 is non-existent
    const {rows, fields} = buildM023([
      '2025-03-30 01:30:00',
      '2025-03-30 02:30:00',
      '2025-03-30 03:30:00',
    ]);
    const result = parse(rows, fields);
    expect(result.success).toBe(false);
    expect(result.errorMessage).toMatch(/Non-existent local time/);
  });

  test('duplicated timestamps → error', () => {
    const {rows, fields} = buildM023([
      '2025-01-01 00:00:00',
      '2025-01-01 00:00:00',
      '2025-01-01 01:00:00',
    ]);
    const result = parse(rows, fields);
    expect(result.success).toBe(false);
    expect(result.errorMessage).toMatch(/Duplicated index entries/);
  });

  for (const [label, values, expected] of [
    ['integers', [1e6, 2e6, 3e6], [1, 2, 3]],
    ['negative', [1e6, -2e6, 3e6], [1, -2, 3]],
    ['floats', [1e6, 2.5e6, -3.5e6], [1, 2.5, -3.5]],
  ]) {
    test(`values W→MW: ${label}`, () => {
      const {rows, fields} = buildM023(M023_WINTER, values);
      expect(parse(rows, fields).data.map((r) => r.load_value)).toEqual(expected);
    });
  }

  for (const [label, values, errPattern] of [
    ['null value', [1, null, 3], /Null values detected/],
    ['empty string', [1, '', 3], /Null values detected/],
    ['non-numeric string', ['1', 'string', '3'], /Invalid numeric value/],
    ['"null" string', ['1', 'null', '3'], /Invalid numeric value/],
  ]) {
    test(`invalid values: ${label} → error`, () => {
      const {rows, fields} = buildM023(M023_WINTER, values);
      const result = parse(rows, fields);
      expect(result.success).toBe(false);
      expect(result.errorMessage).toMatch(errPattern);
    });
  }
});

// ── CSV fixtures ──────────────────────────────────────────────────────────────
// Integration tests against the real Enedis template files in src/tests/fixtures/.
// They mirror the exact PapaParse call made by CsvUploader in the browser.

describe('CSV fixtures', () => {
  function parseFile(filename) {
    const content = fs.readFileSync(path.join(__dirname, 'fixtures', filename), 'utf8');
    const {data: rows, meta} = Papa.parse(content, {
      header: true,
      dynamicTyping: true, // mirrors CsvUploader: auto-casts numbers; ISO+tz strings → Date
      skipEmptyLines: true,
    });
    return parse(rows, meta.fields);
  }

  test('Simple: 2-column, tz-aware UTC timestamps, meterpoint_id "0"', () => {
    const result = parseFile('pricing_template_simple.csv');
    expect(result.success).toBe(true);
    expect(result.fields).toEqual(['delivery_from', 'load_value', 'meterpoint_id']);
    expect(result.data.length).toBe(96); // 2 days × 48 half-hour slots
    expect(result.data[0].meterpoint_id).toBe('0');
    expect(result.data[0].delivery_from).toBe('2024-12-10T00:00:00.000Z');
    expect(result.data[0].load_value).toBeCloseTo(1.1548881401319515, 10);
    expect(result.data[95].delivery_from).toBe('2024-12-11T23:30:00.000Z');
    // meterpoint_id is set only on the first row
    expect(result.data[1].meterpoint_id).toBe(null);
  });

  test('M021: multi-header, CET→UTC, meterpoint_id from header row', () => {
    const result = parseFile('pricing_template_m021.csv');
    expect(result.success).toBe(true);
    // PapaParse dynamicTyping converts the numeric PRM to a JS number
    expect(result.data[0].meterpoint_id).toBe(12345);
    // 2022-01-01T00:00:00+01:00 → PapaParse Date object → toISOString() = UTC
    expect(result.data[0].delivery_from).toBe('2021-12-31T23:00:00.000Z');
    expect(result.data[0].load_value).toBeCloseTo(0.005, 10); // 5000 W → MW
    expect(result.data[1].meterpoint_id).toBe(null);
  });

  test('M022: French date/time, PRM from first row, Paris CET→UTC', () => {
    const result = parseFile('pricing_template_m022.csv');
    expect(result.success).toBe(true);
    // PapaParse dynamicTyping converts PRM cell "1234" to number 1234
    expect(result.data[0].meterpoint_id).toBe(1234);
    // 01/11/2021 00:00:00 Paris CET (UTC+1) → 2021-10-31T23:00:00Z
    expect(result.data[0].delivery_from).toBe('2021-10-31T23:00:00.000Z');
    expect(result.data[0].load_value).toBeCloseTo(0.018, 10); // 18 000 W → MW
    expect(result.data[1].meterpoint_id).toBe(null);
  });

  test('M023: W rows only (VAr filtered), meterpoint_id 123456, Paris CET→UTC', () => {
    const result = parseFile('pricing_template_m023.csv');
    expect(result.success).toBe(true);
    // PapaParse dynamicTyping converts "123456" to number 123456
    expect(result.data[0].meterpoint_id).toBe(123456);
    // 2022-11-01 00:00:00 Paris CET (UTC+1) → 2022-10-31T23:00:00Z
    expect(result.data[0].delivery_from).toBe('2022-10-31T23:00:00.000Z');
    expect(result.data[0].load_value).toBeCloseTo(294e-6, 10); // 294 W → MW
    expect(result.data[1].meterpoint_id).toBe(null);
    // No raw-watt values should have slipped through unfilterd
    expect(result.data.every((r) => r.load_value < 1)).toBe(true);
  });
});
