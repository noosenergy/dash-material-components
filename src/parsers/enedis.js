/**
 * Enedis CSV parser for the Dash CsvUploader component.
 *
 * Auto-detects and normalises four Enedis export formats:
 *   Simple  — two-column (delivery_from, load_value), tz-aware index, values already in MW
 *   M021    — multi-header layout, tz-aware Horodate, values in W
 *   M022    — French date/time columns, naive Europe/Paris local time, values in W
 *   M023    — multi-row export, naive Europe/Paris Horodate, W-unit rows only
 *
 * Output rows carry two fields:
 *   delivery_from  — UTC ISO-8601 string  (e.g. "2022-01-01T00:00:00.000Z")
 *   load_value     — float, in MW
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
      if (fields.includes('PRM')) return parseM022(rows);
      if (fields.includes('Horodate') && fields.includes('Valeur')) return parseM023(rows);
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
    return buildResult(timestamps, values);
  }

  /**
   * M021 — multi-header layout.
   *   row 0  : metadata — meterpoint_id lives in the first column
   *   row 1  : sub-header — "Horodate" in col[0], "Valeur" in col[1]
   *   rows 2+: time series — col[0] = tz-aware ISO timestamp, col[1] = W value
   */
  function parseM021(rows, fields) {
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
    return buildResult(timestamps, values);
  }

  /**
   * M022 — separate date/time columns, naive Europe/Paris local time, values in W.
   * Date column format: DD/MM/YYYY  |  Time column format: HH:MM:SS
   */
  function parseM022(rows) {
    var isos = rows.map(function (r) {
      return frenchToIso(String(r['Date de la mesure']), String(r['Heure de la mesure']));
    });
    var timestamps = parisNaiveSeriesToUTC(isos);
    var values = rows.map(function (r) {
      return parseValue(r['Valeur']) * 1e-6; // W → MW
    });
    return buildResult(timestamps, values);
  }

  /**
   * M023 — multi-measurement rows; retain only Watt rows, naive Europe/Paris
   * Horodate (ISO format: YYYY-MM-DD HH:MM:SS), values in W.
   */
  function parseM023(rows) {
    // Ignore reactive power rows (VAr) — keep active power only
    var wRows = rows.filter(function (r) {
      return r['Unité'] === 'W';
    });
    var isos = wRows.map(function (r) {
      return String(r['Horodate']).replace(' ', 'T');
    });
    var timestamps = parisNaiveSeriesToUTC(isos);
    var values = wRows.map(function (r) {
      return parseValue(r['Valeur']) * 1e-6; // W → MW
    });
    return buildResult(timestamps, values);
  }

  // ── Result builder ────────────────────────────────────────────────────────

  /**
   * Validates parsed timestamps/values, then packages them into the
   * { success, data, fields } contract expected by CsvUploader.
   * Checks for nulls and duplicate UTC timestamps, then sorts ascending.
   */
  function buildResult(timestamps, values) {
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

    var outFields = ['delivery_from', 'load_value'];
    var outRows = pairs.map(function (p) {
      return {delivery_from: p.ts, load_value: p.v};
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

  // Europe/Paris only ever uses two offsets: CEST (+2h) and CET (+1h).
  var PARIS_OFFSETS = [7200000, 3600000]; // ordered so the earlier UTC instant comes first

  /**
   * Returns every UTC instant (ms) whose Paris local time equals the naive ISO
   * input, ascending. Normal times yield one candidate; an autumn fall-back hour
   * yields two (CEST then CET); a non-existent spring-forward time yields none.
   *
   * A candidate `naiveMs - off` is real only if Paris actually uses `off` there,
   * which we confirm by re-measuring the offset at the candidate instant.
   */
  function parisNaiveCandidates(iso) {
    var naiveMs = Date.parse(iso + 'Z'); // treat naive as UTC for a ms baseline
    if (isNaN(naiveMs)) throw new Error('Invalid datetime: ' + iso);

    var utcs = PARIS_OFFSETS.filter(function (off) {
      return parisOffsetMs(naiveMs - off) === off;
    }).map(function (off) {
      return naiveMs - off;
    });

    if (!utcs.length)
      throw new Error('Non-existent local time in Europe/Paris (spring-forward gap): ' + iso);
    return utcs;
  }

  /**
   * Converts an ordered array of naive Europe/Paris ISO strings to UTC ISO
   * strings. Chronological input order resolves the autumn fall-back ambiguity:
   * for a repeated clock hour, the earliest not-yet-used instant is taken, so the
   * first 02:00 maps to CEST (UTC+2) and the second to CET (UTC+1) instead of
   * both collapsing onto the same UTC timestamp.
   */
  function parisNaiveSeriesToUTC(isos) {
    var prevMs = -Infinity;
    return isos.map(function (iso) {
      var utcs = parisNaiveCandidates(iso);
      var chosen = utcs.find(function (ms) {
        return ms > prevMs;
      });
      if (chosen === undefined) chosen = utcs[utcs.length - 1];
      prevMs = chosen;
      return new Date(chosen).toISOString();
    });
  }

  /**
   * Converts French-formatted date ("DD/MM/YYYY") and time ("HH:MM:SS") strings
   * to an ISO string "YYYY-MM-DDTHH:MM:SS" for parisNaiveSeriesToUTC.
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
