import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Box} from '@material-ui/core';
import {DataGrid, GridToolbar} from '@mui/x-data-grid';

function getIndexedRows(rows) {
  rows.forEach((row, i) => {
    row['id'] = i;
    row['editable'] = false;
  });
  return rows;
}

/**
 * Table component
 */
export default class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {rows: this.props.rows};
  }

  UNSAFE_componentWillReceiveProps = (nextProps, nextContent) => {
    if (nextProps.rows !== this.state.rows) this.setState({rows: nextProps.rows});
  };

  render() {
    // props & state
    const {id, columns, rowsPerPage} = this.props;
    let {rows} = this.state;

    return (
      <Box id={id}>
        <DataGrid
          components={{Toolbar: GridToolbar}}
          rows={getIndexedRows(rows)}
          columns={columns}
          pageSize={rowsPerPage}
          rowsPerPageOptions={[rowsPerPage]}
          density="compact"
          autoHeight
        />
      </Box>
    );
  }
}

Table.defaultProps = {
  id: 'table',
  rowsPerPage: 10,
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

      /** Column name */
      headerName: PropTypes.string,

      /** Column width */
      width: PropTypes.number,
    })
  ),

  /** Array of table rows to render */
  rows: PropTypes.arrayOf(PropTypes.object),

  /** Table pagination setting */
  rowsPerPage: PropTypes.number,
};
