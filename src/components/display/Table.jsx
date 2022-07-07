import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Box, Table as MuiTable, TableContainer, TablePagination} from '@material-ui/core';

import {TableBody, TableHead} from '../../fragments/TableContent';

/**
 * Table component
 */
export default class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rows: props.rows,
//       rowsPerPage: props.rowsPerPageOptions[0]
      rowsPerPage: props.rows.count
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
    // Make sure state remain in sync with received props
    if (nextProps.rows !== this.state.rows) this.setState({rows: nextProps.rows});
  };

  render() {
    // props & state
    const {id, columns, rowsPerPageOptions} = this.props;
    let {page, rows, rowsPerPage} = this.state;

    return (
      <Box id={id}>
        <TableContainer sx={{height: '100%'}}>
          <MuiTable stickyHeader size="small" aria-label="data table">
            <TableHead columns={columns} />
            <TableBody rows={rows} page={page} rowsPerPage={rowsPerPage} />
          </MuiTable>
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

Table.defaultProps = {
  id: 'table',
  rowsPerPageOptions: 0
};

Table.propTypes = {
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
      width: PropTypes.number
    })
  ).isRequired,

  /** Array of table rows to render */
  rows: PropTypes.arrayOf(PropTypes.object),

  /** Table pagination setting */
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number)
};
