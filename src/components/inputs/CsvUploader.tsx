import React, {memo, Suspense} from 'react';
import {asyncDecorator} from '@plotly/dash-component-plugins';
import csvUploader from '../../utils/LazyLoader/CsvUploader';
import {DashComponentProps} from 'props';

/**
 * Column-major file data sent to the Dash server on submit.
 * `data[i]` holds every value for `columns[i]`, enabling direct
 * PyArrow table creation: `pa.table(dict(zip(columns, data))).to_pandas()`.
 */
export type FileOutput = {
  /** Original file name */
  name: string;
  /** Ordered column names */
  columns: string[];
  /** Column-major values: data[colIndex][rowIndex] */
  data: (string | number | boolean | null)[][];
  /** Number of data rows (header excluded) */
  n_rows: number;
  /** Number of columns */
  n_cols: number;
};

export type CsvUploaderProps = {
  /** Label displayed above the drop zone */
  labelText?: string;
  /** Allow selecting and uploading multiple CSV files at once */
  multiple?: boolean;
  /** Maximum allowed file size in megabytes */
  maxSizeMb?: number;
  /**
   * ID of a custom parser function registered in `window.DashCsvParsers`.
   *
   * Register it in a file placed in your Dash `assets/` folder:
   * ```js
   * window.DashCsvParsers = window.DashCsvParsers || {};
   * window.DashCsvParsers["my_parser"] = function(rows, fields) {
   *   // rows: [{col: value, ...}, ...]  fields: ["col", ...]
   *   if (!fields.includes("required_col"))
   *     return { success: false, errorMessage: "Missing required_col" };
   *   return { success: true, data: rows, fields };
   * };
   * ```
   */
  parserId?: string | null;
  /** Component margin */
  margin?: string | number;
  /** Component width (CSS value) */
  width?: string | number;
  /** Disable the component */
  disabled?: boolean;
  /** Incremented each time data is pushed to the server (manual Upload click or auto-upload) */
  nSubmits?: number;
  /**
   * Column-major contents of successfully parsed files.
   * Populated on Upload click (`"full"`), or automatically after each parse (`"auto-upload"`).
   * Each entry: `{ name, columns, data, n_rows, n_cols }` where `data[i]` holds all values
   * for `columns[i]`. Reconstruct with PyArrow:
   * ```python
   * import pyarrow as pa
   * df = pa.table(dict(zip(d["columns"], d["data"]))).to_pandas()
   * ```
   */
  contents?: FileOutput[];
  /**
   * Controls upload behaviour:
   * - `"full"` (default) — explicit Upload button; data sent on click.
   * - `"auto-upload"` — data pushed to Dash automatically after each successful parse; no button shown.
   * - `"download-only"` — parsing and download only; no upload to server.
   */
  variant?: 'full' | 'auto-upload' | 'download-only';
} & DashComponentProps;

/**
 * CsvUploader component
 *
 * Drag-and-drop / browse CSV uploader with optional client-side validation via
 * a custom `window.DashCsvParsers[parserId]` function (register it in your
 * Dash `assets/` folder). Parsed data is sent to the server in column-major
 * JSON format — reconstruct with PyArrow:
 * `pa.table(dict(zip(d["columns"], d["data"]))).to_pandas()`.
 */
const CsvUploader = (props: CsvUploaderProps) => {
  return <ControlledCsvUploader {...props} />;
};

// Async-decorated version (internal)
const RealCsvUploader = asyncDecorator(CsvUploader, () =>
  Promise.all([csvUploader()]).then(([csvUploader]) => csvUploader)
);

// Controlled version with Suspense (internal)
const ControlledCsvUploader = memo<CsvUploaderProps>((props) => {
  const {id, className} = props;
  const extendedClassName = className ? 'dash-csv-uploader ' + className : 'dash-csv-uploader';

  return (
    <Suspense
      fallback={
        <div id={id} key={id} className={`${extendedClassName} dash-csv-uploader--pending`}>
          Loading uploader...
        </div>
      }
    >
      <RealCsvUploader {...props} className={extendedClassName} />
    </Suspense>
  );
});

ControlledCsvUploader.displayName = 'ControlledCsvUploader';

export default CsvUploader;
