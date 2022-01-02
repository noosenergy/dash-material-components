import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {
  TableBody as MuiTableBody,
  TableCell,
  TableHead as MuiTableHead,
  TableRow,
} from '@material-ui/core';

const TableHead = class extends Component {
  render() {
    const {columns} = this.props;

    // locals
    let headerElements = [];

    // Fetch table header
    columns.forEach((column, i) => {
      headerElements.push(
        <TableCell key={i} style={{width: column.width}}>
          {column.field}
        </TableCell>
      );
    });

    return (
      <MuiTableHead>
        <TableRow>{headerElements}</TableRow>
      </MuiTableHead>
    );
  }
};

TableHead.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.exact({
      field: PropTypes.string,
      width: PropTypes.number,
    })
  ),
};

const TableBody = class extends Component {
  render() {
    const {rows, page, rowsPerPage} = this.props;

    // locals
    let bodyElements = [];
    const startRow = rowsPerPage * page;
    const endRow = startRow + rowsPerPage;

    // Fetch table body
    rows.slice(startRow, endRow).forEach((row, i) => {
      bodyElements.push(
        <TableRow hover key={i}>
          {Object.keys(row).map((key, j) => (
            <TableCell key={j}>{row[key]}</TableCell>
          ))}
        </TableRow>
      );
    });

    return <MuiTableBody>{bodyElements}</MuiTableBody>;
  }
};

TableBody.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object),
  page: PropTypes.number,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
};

export {TableHead, TableBody};
