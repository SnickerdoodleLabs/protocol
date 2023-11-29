import { Box, TablePagination, Typography } from "@material-ui/core";
import { PurchasedProduct } from "@snickerdoodlelabs/objects";
import { useMedia } from "@snickerdoodlelabs/shared-components";
import React, { useState } from "react";

import { useStyles } from "@extension-onboarding/pages/Details/screens/ShoppingData/Platforms/Amazon/Amazon.style";

interface IAmazonTableProps {
  product: PurchasedProduct[];
  defaultItemsPerPage?: 5 | 10 | 25;
}

export const AmazonTable = ({
  product,
  defaultItemsPerPage = 5,
}: IAmazonTableProps) => {
  const classes = useStyles();
  const currentBreakPoint = useMedia();

  const [rowsPerPage, setRowsPerPage] = useState(defaultItemsPerPage as number);
  const [page, setPage] = useState(0);
  const [sortOrderByPrice, setSortOrderByPrice] = useState<"asc" | "desc">(
    "desc",
  );
  const [sortBy, setSortBy] = useState<"date" | "price">("date");

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSortBy = (sortField: "date" | "price") => {
    setSortBy(sortField);
    {
      sortField === "price" &&
        setSortOrderByPrice(sortOrderByPrice === "asc" ? "desc" : "asc");
    }
  };

  const sortedData = product.sort((a, b) => {
    if (sortBy === "date") {
      const dateA = new Date(a.datePurchased).getTime();
      const dateB = new Date(b.datePurchased).getTime();
      return /* sortOrderByPrice === "asc" ? dateA - dateB : */ dateB - dateA;
    } else if (sortBy === "price") {
      return sortOrderByPrice === "asc" ? a.price - b.price : b.price - a.price;
    }
    return 0;
  });

  const slicedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Box
      display="flex"
      border="1px solid #FAFAFA"
      borderRadius={12}
      minHeight={440}
      flexDirection="column"
    >
      <Box
        display="flex"
        py={2}
        px={3}
        justifyContent="space-between"
        bgcolor="#FFFFFF"
      >
        <Typography
          className={classes.tableTitle}
          onClick={() => handleSortBy("date")}
        >
          Product Name
        </Typography>
        <Typography
          className={classes.tableTitle}
          onClick={() => handleSortBy("date")}
        >
          Brand
        </Typography>
        <Typography
          className={classes.tableTitle}
          onClick={() => handleSortBy("date")}
        >
          Category
        </Typography>
        <Box mr={2} onClick={() => handleSortBy("price")}>
          <Typography className={classes.tableTitle}>
            Price {sortOrderByPrice === "asc" ? "▲" : "▼"}
          </Typography>
        </Box>
      </Box>
      <Box>
        {slicedData.map((prod, index) => (
          <Box key={prod.id}>
            <Box
              display="flex"
              marginTop="auto"
              alignItems="center"
              justifyContent="space-between"
              py={3}
              px={3}
              bgcolor={index % 2 === 0 ? "#F1EFF680" : "#FFFFFF"}
            >
              <Typography
                className={classes.paginationText}
                style={{ flex: 1.78 }}
              >
                {prod.name.length > 20
                  ? prod.name.slice(0, 20) + "..."
                  : prod.name}
              </Typography>
              <Typography
                className={classes.paginationText}
                style={{ flex: 1.6 }}
              >
                {!prod.brand && "NaN"}
                {prod.brand}
              </Typography>
              <Typography
                className={classes.paginationText}
                style={{ flex: 0.9 }}
              >
                {prod.category}
              </Typography>
              <Typography
                className={classes.paginationText}
                style={{ flex: 1, textAlign: "end" }}
              >
                ${prod.price}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
      <Box mt={1}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={product.length}
          rowsPerPage={rowsPerPage}
          labelRowsPerPage={currentBreakPoint === "xs" ? "" : "Rows per page:"}
          align={currentBreakPoint === "xs" ? "center" : "left"}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Box>
  );
};
