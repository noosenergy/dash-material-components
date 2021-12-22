import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Box} from '@material-ui/core';
import {DataGrid, GridToolbar} from '@mui/x-data-grid';
import {withStyles} from '@material-ui/core/styles';

const styles = (theme) => ({
  tableLayout: {
    height: '100%',
    // flewGrow: 1,
  },
});

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
class Table extends Component {
  render() {
    // props & state
    const {classes, id, columns, rows, pageSize} = this.props;

    return (
      <Box id={id} className={classes.tableLayout}>
        <DataGrid
          components={{Toolbar: GridToolbar}}
          rows={getIndexedRows(rows)}
          columns={columns}
          pageSize={pageSize}
          autoHeight
        />
      </Box>
    );
  }
}

Table.defaultProps = {
  id: 'table',
  pageSize: 10,
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

  /** Table page size */
  pageSize: PropTypes.number,
};

export default withStyles(styles, {withTheme: true})(Table);
