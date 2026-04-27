/**
 * Enedis CSV parser for the Dash CsvUploader component.
 *
 * Auto-detects and normalises four Enedis export formats:
 *   Simple  — two-column (delivery_from, load_value), tz-aware index, values already in MW
 *   M021    — multi-header layout, tz-aware Horodate, values in W
 *   M022    — French date/time columns, naive Europe/Paris local time, values in W
 *   M023    — multi-row export, naive Europe/Paris Horodate, W-unit rows only
 *
 * Output rows carry three fields:
 *   delivery_from  — UTC ISO-8601 string  (e.g. "2022-01-01T00:00:00.000Z")
 *   load_value     — float, in MW
 *   meterpoint_id  — PRM identifier; populated only on the first row, null elsewhere
 *
 * Register as: window.DashCsvParsers["enedis"] (done below).
 * Place this file in your Dash assets/ folder; it is auto-served and injected
 * into the page before the CsvUploader component renders.
 */
(function () {
  'use strict';

  window.DashCsvParsers = window.DashCsvParsers || {};

  // ── Main entry point ──────────────────────────────────────────────────────

  /**
   * Called by CsvUploader after PapaParse finishes (header:true, dynamicTyping:true).
   * Dispatches to the right sub-parser based on column signatures, mirroring
   * the Python parse_find_template() detection order.
   */
  window.DashCsvParsers['enedis'] = function (rows, fields) {
    try {
      if (fields.length === 2) return parseSimple(rows, fields);
      if (fields.includes('PRM')) return parseM022(rows, fields);
      if (fields.includes('Horodate') && fields.includes('Valeur')) return parseM023(rows, fields);
      if (fields.includes('Identifiant PRM')) return parseM021(rows, fields);

      return {
        success: false,
        errorMessage:
          'Incorrect file format. ' +
          "No columns matching 'Horodate' and 'Valeur', or 'PRM', or 'Identifiant PRM'."
      };
    } catch (e) {
      return {success: false, errorMessage: e.message};
    }
  };

  // ── Template parsers ──────────────────────────────────────────────────────

  /** Simple 2-column template: col[0] = tz-aware timestamp, col[1] = load in MW. */
  function parseSimple(rows, fields) {
    var timestamps = rows.map(function (r) {
      var ts = r[fields[0]];
      if (!isTzAware(ts)) throw new Error('Index must be timezone aware.');
      return toUTCIso(ts);
    });
    var values = rows.map(function (r) {
      return parseValue(r[fields[1]]); // no unit conversion — already MW
    });
    return buildResult(timestamps, values, '0');
  }

  /**
   * M021 — multi-header layout.
   *   row 0  : metadata — meterpoint_id lives in the first column
   *   row 1  : sub-header — "Horodate" in col[0], "Valeur" in col[1]
   *   rows 2+: time series — col[0] = tz-aware ISO timestamp, col[1] = W value
   */
  function parseM021(rows, fields) {
    var meterpointId = rows[0][fields[0]];

    // Validate the expected sub-header row to catch misidentified files early
    if (rows[1][fields[0]] !== 'Horodate' || rows[1][fields[1]] !== 'Valeur')
      throw new Error("M021: unexpected sub-header layout (expected 'Horodate' / 'Valeur').");

    var dataRows = rows.slice(2);
    var timestamps = dataRows.map(function (r) {
      var ts = r[fields[0]];
      if (!isTzAware(ts)) throw new Error('Index must be timezone aware.');
      return toUTCIso(ts);
    });
    var values = dataRows.map(function (r) {
      return parseValue(r[fields[1]]) * 1e-6; // W → MW
    });
    return buildResult(timestamps, values, meterpointId);
  }

  /**
   * M022 — separate date/time columns, naive Europe/Paris local time, values in W.
   * Date column format: DD/MM/YYYY  |  Time column format: HH:MM:SS
   */
  function parseM022(rows, fields) {
    var meterpointId = rows[0]['PRM'];
    var timestamps = rows.map(function (r) {
      var iso = frenchToIso(String(r['Date de la mesure']), String(r['Heure de la mesure']));
      return parisNaiveToUTC(iso).toISOString();
    });
    var values = rows.map(function (r) {
      return parseValue(r['Valeur']) * 1e-6; // W → MW
    });
    return buildResult(timestamps, values, meterpointId);
  }

  /**
   * M023 — multi-measurement rows; retain only Watt rows, naive Europe/Paris
   * Horodate (ISO format: YYYY-MM-DD HH:MM:SS), values in W.
   */
  function parseM023(rows, fields) {
    var meterpointId = rows[0]['Identifiant PRM'];
    // Ignore reactive power rows (VAr) — keep active power only
    var wRows = rows.filter(function (r) {
      return r['Unité'] === 'W';
    });
    var timestamps = wRows.map(function (r) {
      var iso = String(r['Horodate']).replace(' ', 'T');
      return parisNaiveToUTC(iso).toISOString();
    });
    var values = wRows.map(function (r) {
      return parseValue(r['Valeur']) * 1e-6; // W → MW
    });
    return buildResult(timestamps, values, meterpointId);
  }

  // ── Result builder ────────────────────────────────────────────────────────

  /**
   * Validates parsed timestamps/values, then packages them into the
   * { success, data, fields } contract expected by CsvUploader.
   * Checks for nulls and duplicate UTC timestamps, then sorts ascending.
   * meterpoint_id is written only on the first row to minimise transfer size;
   * reconstruct server-side with df['meterpoint_id'].ffill() or .iloc[0].
   */
  function buildResult(timestamps, values, meterpointId) {
    // Null / NaN guard (parseValue already threw for truly invalid entries;
    // this catches any null that slipped through from optional columns)
    for (var i = 0; i < values.length; i++) {
      if (values[i] === null || values[i] === undefined) throw new Error('Null values detected:');
    }

    // Duplicate UTC timestamp check
    var seen = {};
    for (var j = 0; j < timestamps.length; j++) {
      if (seen[timestamps[j]])
        throw new Error('Duplicated index entries detected: ' + timestamps[j]);
      seen[timestamps[j]] = true;
    }

    // Sort ascending by delivery_from (UTC ISO strings sort lexicographically)
    var pairs = timestamps.map(function (ts, i) {
      return {ts: ts, v: values[i]};
    });
    pairs.sort(function (a, b) {
      return a.ts < b.ts ? -1 : a.ts > b.ts ? 1 : 0;
    });

    var outFields = ['delivery_from', 'load_value', 'meterpoint_id'];
    var outRows = pairs.map(function (p, i) {
      return {delivery_from: p.ts, load_value: p.v, meterpoint_id: i === 0 ? meterpointId : null};
    });

    return {success: true, data: outRows, fields: outFields};
  }

  // ── Timestamp helpers ─────────────────────────────────────────────────────

  /**
   * Returns true when val is a timezone-aware datetime.
   * PapaParse 5.5+ converts ISO date strings (YYYY-MM-DDTHH:MM:SS+HH:MM) to Date
   * objects via dynamicTyping, so we accept both strings with offset and Date instances.
   */
  function isTzAware(val) {
    if (val instanceof Date) return !isNaN(val.getTime());
    return /Z$|[+-]\d{2}:?\d{2}$/.test(String(val).trim());
  }

  /**
   * Converts a tz-aware value to a UTC ISO string.
   * Accepts a Date object (already UTC-correct) or a string with space/T separator.
   */
  function toUTCIso(val) {
    if (val instanceof Date) {
      if (isNaN(val.getTime())) throw new Error('Invalid datetime: Null value detected');
      return val.toISOString();
    }
    var d = new Date(String(val).replace(' ', 'T'));
    if (isNaN(d.getTime())) throw new Error('Invalid datetime: ' + val);
    return d.toISOString();
  }

  // How many ms Europe/Paris is ahead of UTC at a given UTC timestamp.
  // Memoised by UTC-hour bucket: Paris has only two offsets (+1h CET / +2h CEST)
  // so a year of 15-min data needs at most ~8 760 Intl calls instead of O(n).
  var _parisOffsetCache = {};
  function parisOffsetMs(ms) {
    var bucket = Math.floor(ms / 3600000);
    if (bucket in _parisOffsetCache) return _parisOffsetCache[bucket];
    var parisStr = new Date(ms).toLocaleString('sv', {timeZone: 'Europe/Paris'});
    var offset = Date.parse(parisStr.replace(' ', 'T') + 'Z') - ms;
    _parisOffsetCache[bucket] = offset;
    return offset;
  }

  /**
   * Converts a naive datetime ISO string (YYYY-MM-DDTHH:MM:SS) assumed to be in
   * Europe/Paris to a UTC Date object.
   *
   * Algorithm (DST-safe, no external library):
   *   1. Measure the Paris UTC offset at the naive timestamp treated as UTC.
   *   2. Subtract the offset to get a first UTC estimate.
   *   3. Refine once — the corrected UTC may fall in a different DST regime,
   *      so we measure the offset again at the estimate and re-subtract.
   *   4. Round-trip check: paris_local(utc) must reproduce the original input
   *      (within 1 min). Uses the cached offset so no extra Intl call is needed.
   *      Non-existent spring-forward times cause a mismatch and throw.
   *
   * Ambiguous fall-back times (same clock hour repeated twice) are silently
   * resolved to the post-transition occurrence (CET, UTC+1).
   */
  function parisNaiveToUTC(iso) {
    var naiveMs = Date.parse(iso + 'Z'); // treat naive as UTC to get a ms baseline
    if (isNaN(naiveMs)) throw new Error('Invalid datetime: ' + iso);

    // Two-pass correction (one pass is sufficient for most dates; two covers DST edges)
    var utc = naiveMs - parisOffsetMs(naiveMs);
    utc = naiveMs - parisOffsetMs(utc);

    // Detect non-existent times: paris_local(utc) = utc + offset must equal the input
    if (Math.abs(utc + parisOffsetMs(utc) - naiveMs) > 60000)
      throw new Error('Non-existent local time in Europe/Paris (spring-forward gap): ' + iso);

    return new Date(utc);
  }

  /**
   * Converts French-formatted date ("DD/MM/YYYY") and time ("HH:MM:SS") strings
   * to an ISO string "YYYY-MM-DDTHH:MM:SS" for parisNaiveToUTC.
   */
  function frenchToIso(dateStr, timeStr) {
    var parts = dateStr.split('/');
    if (parts.length !== 3)
      throw new Error('Invalid French date format (expected DD/MM/YYYY): ' + dateStr);
    return parts[2] + '-' + parts[1] + '-' + parts[0] + 'T' + timeStr;
  }

  // ── Value helper ──────────────────────────────────────────────────────────

  /**
   * Casts val to a finite float; throws descriptive errors on null, empty,
   * or non-numeric values.
   * PapaParse (dynamicTyping:true) already converts numeric cells to JS numbers,
   * so the parseFloat path handles only string edge cases ("null", "string", etc.).
   */
  function parseValue(val) {
    if (val === null || val === undefined || val === '') throw new Error('Null values detected.');
    var f = typeof val === 'number' ? val : parseFloat(String(val));
    if (isNaN(f)) throw new Error('Invalid numeric value: "' + val + '"');
    return f;
  }
})();
