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

const TableHead = ({columns}: {columns: TableColumn[]}) => (
  <MuiTableHead>
    <TableRow>
      {columns.map((col, i) => (
        <TableCell key={i} style={{width: col.width}}>
          {col.field}
        </TableCell>
      ))}
    </TableRow>
  </MuiTableHead>
);

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
            <TableCell key={j}>{getValue(row, col.field)}</TableCell>
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
