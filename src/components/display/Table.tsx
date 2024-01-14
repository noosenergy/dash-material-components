import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Box, Table as MuiTable, TableContainer, TablePagination} from '@mui/material';
import {TableBody, TableHead} from '../../fragments/TableContent';
import {DashComponentProps} from 'props';

/**
 * Table component
 */
const Table = ({
  id = 'table',
  columns,
  rows: initialRows,
  rowsPerPageOptions = [10, 25, 50]
}: TableProps) => {
  const [rows, setRows] = useState(initialRows);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  // Make sure state remains in sync with received props
  useEffect(() => setRows(initialRows), [initialRows]);

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

// TypeScript props type
type TableProps = {
  /** Array of table columns to render */
  columns: Array<{
    /** Column field */
    field: string;
    /** Column width */
    width: number;
  }>;
  /** Array of table rows to render */
  rows: Array<object>;
  /** Table pagination setting */
  rowsPerPageOptions?: Array<number>;
} & DashComponentProps;

// PropTypes for runtime type checking
Table.propTypes = {
  /** Used to identify dash components in callbacks */
  id: PropTypes.string,

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

// Default props
Table.defaultProps = {};

export default Table;
