import React from 'react';
import {
  TableBody as MuiTableBody,
  TableCell,
  TableHead as MuiTableHead,
  TableRow
} from '@mui/material';

const TableHead = ({columns}: TableHeadProps) => {
  const headerElements = columns.map((column, i) => (
    <TableCell key={i} style={{width: column.width}}>
      {column.field}
    </TableCell>
  ));

  return (
    <MuiTableHead>
      <TableRow>{headerElements}</TableRow>
    </MuiTableHead>
  );
};

// Type definition for TableHead's props
type TableColumn = {
  field?: string;
  width?: number;
};

type TableHeadProps = {
  columns: TableColumn[];
};

const TableBody = ({rows, page, rowsPerPage}: TableBodyProps) => {
  const startRow = rowsPerPage * page;
  const endRow = startRow + rowsPerPage;

  const bodyElements = rows.slice(startRow, endRow).map((row, i) => (
    <TableRow hover key={i}>
      {Object.keys(row).map((key, j) => (
        <TableCell key={j}>{row[key]}</TableCell>
      ))}
    </TableRow>
  ));

  return <MuiTableBody>{bodyElements}</MuiTableBody>;
};

type TableBodyProps = {
  rows: TableRowData[];
  page: number;
  rowsPerPage: number;
};

type TableRowData = {[key: string]: any};

export {TableHead, TableBody};
