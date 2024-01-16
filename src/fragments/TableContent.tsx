import React from 'react';
import PropTypes from 'prop-types';
import {
  TableBody as MuiTableBody,
  TableCell,
  TableHead as MuiTableHead,
  TableRow
} from '@mui/material';

const TableHead = (props) => {
  const {columns} = props;

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

TableHead.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.exact({
      field: PropTypes.string,
      width: PropTypes.number
    })
  )
};

const TableBody = (props) => {
  const {rows, page, rowsPerPage} = props;

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

TableBody.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object),
  page: PropTypes.number,
  rowsPerPage: PropTypes.number
};

export {TableHead, TableBody};
