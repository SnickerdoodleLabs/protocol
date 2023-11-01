import { Box, IconButton, Typography } from "@material-ui/core";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";
import { PurchasedProduct } from "@snickerdoodlelabs/objects";
import React, { FC, memo } from "react";

import { useStyles } from "../Amazon.style";

interface IAmazonTableProps {
  product: PurchasedProduct[];
}

interface IPagination {
  currentIndex: number;
  numberOfPages: number;
  totalItems: number;
}

const PAGINATION_RANGE = 5;

export const AmazonTable: FC<IAmazonTableProps> = memo(
  ({ product }: IAmazonTableProps) => {
    const classes = useStyles();

    const getPaginationObject = (itemCount): IPagination | undefined => {
      if (itemCount <= PAGINATION_RANGE) {
        return undefined;
      }
      return {
        currentIndex: 1,
        numberOfPages:
          ((itemCount / PAGINATION_RANGE) | 0) +
          (itemCount % PAGINATION_RANGE != 0 ? 1 : 0),
        totalItems: itemCount,
      };
    };

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
          <Typography className={classes.tableTitle}>Product Name</Typography>
          <Typography className={classes.tableTitle}>Brand</Typography>
          <Typography className={classes.tableTitle}>Category</Typography>
          <Box mr={2}>
            <Typography className={classes.tableTitle}>Price</Typography>
          </Box>
        </Box>
        <Box>
          {product.map((prod, index) => (
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
                  style={{ width: "30%" }}
                >
                  {prod.name.length > 20
                    ? prod.name.slice(0, 20) + "..."
                    : prod.name}
                </Typography>
                <Typography
                  className={classes.paginationText}
                  style={{ width: "25%" }}
                >
                  {!prod.brand && "NaN"}
                  {prod.brand}
                </Typography>
                <Typography
                  className={classes.paginationText}
                  style={{ width: "17%" }}
                >
                  {prod.category}
                </Typography>
                <Typography
                  className={classes.paginationText}
                  style={{ width: "15%", textAlign: "end" }}
                >
                  ${prod.price}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    );
  },
);
