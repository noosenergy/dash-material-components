import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@material-ui/core';

function TableHeader(columns) {
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
    <TableHead>
      <TableRow>{headerElements}</TableRow>
    </TableHead>
  );
}

function TableContent(rows, page, rowsPerPage) {
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

  return <TableBody>{bodyElements}</TableBody>;
}

/**
 * Table component
 */
export default class NewTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rows: this.props.rows,
      rowsPerPage: this.props.rowsPerPageOptions[0],
    };
  }

  handlePageChange = (event, value) => {
    this.setState({page: value});
  };

  handleRowsPerPageChange = (event) => {
    this.setState({rowsPerPage: parseInt(event.target.value, 10)});
    this.setState({page: 0});
  };

  UNSAFE_componentWillReceiveProps = (nextProps, nextContent) => {
    if (nextProps.rows !== this.state.rows) this.setState({rows: nextProps.rows});
  };

  render() {
    // props & state
    const {id, columns, rowsPerPageOptions} = this.props;
    let {page, rows, rowsPerPage} = this.state;

    return (
      <Box id={id}>
        <TableContainer sx={{height: '100%'}}>
          <Table stickyHeader size="small" aria-label="data table">
            {TableHeader(columns)}
            {TableContent(rows, page, rowsPerPage)}
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={this.handlePageChange}
          onRowsPerPageChange={this.handleRowsPerPageChange}
        />
      </Box>
    );
  }
}

NewTable.defaultProps = {
  id: 'table',
  rowsPerPageOptions: [10, 25, 50],
};

NewTable.propTypes = {
  /** Used to identify dash components in callbacks */
  id: PropTypes.string,

  /** Used to enable Dash-assigned component callback */
  setProps: PropTypes.func,

  /** Array of table columns to render */
  columns: PropTypes.arrayOf(
    PropTypes.exact({
      /** Column field */
      field: PropTypes.string,

      /** Column width */
      width: PropTypes.number,
    })
  ),

  /** Array of table rows to render */
  rows: PropTypes.arrayOf(PropTypes.object),

  /** Table pagination setting */
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
};
