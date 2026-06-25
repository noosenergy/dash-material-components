import React from 'react';
import {
  TableBody as MuiTableBody,
  TableCell,
  TableHead as MuiTableHead,
  TableRow
} from '@mui/material';

type TableColumn = {
  field: string;
  width?: number;
};

export type TableRowData = {[key: string]: string | number};

const TableHead = ({columns}: {columns: TableColumn[]}) => {
  // With table-layout: fixed, column widths are taken from the header cells.
  // The first column (sticky row header) keeps its exact declared px width; the
  // remaining columns share the leftover space (100% - firstWidth) proportionally
  // to their declared widths - so they fill the parent and are even when equal.
  const firstWidth = columns[0]?.width || 0;
  const restTotal = columns.slice(1).reduce((sum, col) => sum + (col.width || 0), 0);

  const getWidth = (col: TableColumn, i: number): string | undefined => {
    if (i === 0) return firstWidth ? `${firstWidth}px` : undefined;
    if (!col.width || !restTotal) return undefined;
    return `calc((100% - ${firstWidth}px) * ${col.width / restTotal})`;
  };

  return (
    <MuiTableHead>
      <TableRow>
        {columns.map((col, i) => (
          <TableCell
            key={i}
            align={i === 0 ? 'center' : 'right'}
            style={{width: getWidth(col, i)}}
          >
            {col.field}
          </TableCell>
        ))}
      </TableRow>
    </MuiTableHead>
  );
};

const getValue = (row: TableRowData, field: string): string | number => {
  if (field in row) return row[field];
  const key = Object.keys(row).find((k) => k.toLowerCase() === field.toLowerCase());
  return key !== undefined ? row[key] : '';
};

const TableBody = ({columns, rows, page, rowsPerPage}: TableBodyProps) => {
  const start = rowsPerPage * page;

  return (
    <MuiTableBody>
      {rows.slice(start, start + rowsPerPage).map((row, i) => (
        <TableRow hover key={i}>
          {columns.map((col, j) => (
            <TableCell key={j} align={j === 0 ? 'left' : 'right'}>
              {getValue(row, col.field)}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </MuiTableBody>
  );
};

type TableBodyProps = {
  columns: TableColumn[];
  rows: TableRowData[];
  page: number;
  rowsPerPage: number;
};

export {TableHead, TableBody};
