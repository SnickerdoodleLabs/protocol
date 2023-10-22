import {
  Table as MuiTable,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  Paper,
  TablePagination,
  withStyles,
  makeStyles,
} from "@material-ui/core";
import {
  SDTypography,
  colors,
  useMedia,
} from "@snickerdoodlelabs/shared-components";
import clsx from "clsx";
import React, { useState } from "react";

export interface IColumn<T> {
  label: string;
  align?: "left" | "right" | "center";
  sortKey?: keyof T;
  render: (
    value: T,
    breakPoint: "xs" | "sm" | "md" | "lg" | "xl",
  ) => React.JSX.Element;
  hideOn?: ("xs" | "sm" | "md" | "lg" | "xl")[];
}
const useStyles = makeStyles((theme) => ({
  table: {
    "& tbody tr:nth-child(odd)": {
      backgroundColor: colors.MAINPURPLE50,
    },
  },
}));
const StyledTableCell = withStyles(() => ({}))(TableCell);

interface ITableProps<T> {
  data: T[];
  columns: IColumn<T>[];
  useDoubleColor?: boolean;
  defaultItemsPerPage?: 5 | 10 | 25;
}

interface IWithID {}

const Table = <T extends IWithID>({
  data,
  columns,
  useDoubleColor = true,
  defaultItemsPerPage = 5,
}: ITableProps<T>) => {
  const [orderBy, setOrderBy] = useState<keyof T>();
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultItemsPerPage as number);
  const classes = useStyles();
  const currentBreakPoint = useMedia();
  const handleRequestSort = (property: keyof T) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedData = data.sort((a, b) => {
    const isAsc = order === "asc";
    return isAsc
      ? a[orderBy as string] - b[orderBy as string]
      : b[orderBy as string] - a[orderBy as string];
  });

  return (
    <Paper>
      <MuiTable className={clsx(useDoubleColor && classes.table)}>
        <TableHead>
          <TableRow>
            {columns.map((column, columnIndex) => {
              return column.hideOn &&
                column.hideOn.includes(currentBreakPoint) ? null : (
                <StyledTableCell
                  key={columnIndex}
                  align={column.align ? column.align : "left"}
                  sortDirection={orderBy === column.sortKey ? order : false}
                >
                  {column.sortKey ? (
                    <TableSortLabel
                      active={orderBy === column.sortKey}
                      direction={orderBy === column.sortKey ? order : "asc"}
                      onClick={() => {
                        column.sortKey && handleRequestSort(column.sortKey);
                      }}
                    >
                      <SDTypography
                        variant="titleXs"
                        color="textHeading"
                        fontWeight="medium"
                      >
                        {column.label}
                      </SDTypography>
                    </TableSortLabel>
                  ) : (
                    <SDTypography
                      variant="titleXs"
                      color="textHeading"
                      fontWeight="medium"
                    >
                      {column.label}
                    </SDTypography>
                  )}
                </StyledTableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column) =>
                  column.hideOn &&
                  column.hideOn.includes(currentBreakPoint) ? null : (
                    <TableCell
                      key={JSON.stringify(row) + column.label}
                      align={column.align ? column.align : "left"}
                    >
                      {column.render(row, currentBreakPoint)}
                    </TableCell>
                  ),
                )}
              </TableRow>
            ))}
        </TableBody>
      </MuiTable>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default Table;
