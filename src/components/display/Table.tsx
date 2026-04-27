import React, {useState, useEffect} from 'react';
import {Card, Table as MuiTable, TableContainer, TablePagination} from '@mui/material';
import {TableBody, TableHead, TableRowData} from '../../fragments/TableContent';
import {DashComponentProps} from 'props';

/**
 * Table component
 */
const Table = ({
  id = 'table',
  columns,
  rows: initialRows,
  rowsPerPageOptions = [10, 25, 50],
  tableStyle = {}
}: TableProps) => {
  const [rows, setRows] = useState(initialRows);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  useEffect(() => setRows(initialRows), [initialRows]);

  const handlePageChange = (_: unknown, value: number) => setPage(value);

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Card
      id={id}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        width: 'fit-content',
        maxWidth: '100%'
      }}
    >
      <TableContainer sx={{flexGrow: 1, overflow: 'auto', minHeight: 0, ...tableStyle}}>
        <MuiTable stickyHeader aria-label="data table">
          <TableHead columns={columns} />
          <TableBody columns={columns} rows={rows} page={page} rowsPerPage={rowsPerPage} />
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
    </Card>
  );
};

type TableProps = {
  /** Array of table columns to render */
  columns: Array<{
    /** Column field */
    field: string;
    /** Column width */
    width: number;
  }>;
  /** Array of table rows to render */
  rows: TableRowData[];
  /** Table pagination setting */
  rowsPerPageOptions?: Array<number>;
  /** Custom sx styles for TableContainer - https://mui.com/system/getting-started/the-sx-prop/ */
  tableStyle?: object;
} & DashComponentProps;

export default Table;
