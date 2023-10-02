import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Box, Table as MuiTable, TableContainer, TablePagination} from '@material-ui/core';
import {TableBody, TableHead} from '../../fragments/TableContent';

/**
 * Table component
 */
const Table = (props) => {
  const {id, columns, rowsPerPageOptions, rows} = props;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  // Make sure state remain in sync with received props
  useEffect(() => {
    props.setProps({rows: rows});
  }, [rows]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Box>
  );
};

Table.defaultProps = {
  id: 'table',
  rowsPerPageOptions: [10, 25, 50]
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

export default Table;
