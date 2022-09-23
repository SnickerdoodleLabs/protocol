import { Box, Typography } from "@material-ui/core";
import React, { FC } from "react";

export interface ITokenItem {
  image: string;
  name: string;
  ticker: string;
  balance: number;
  currency: number;
}

const TokenItem: FC<ITokenItem> = (item: ITokenItem) => {
  return (
    <Box display="flex" justifyContent="space-between">
      <Box display="flex">
        <Box ml={1}>
          <img width={36} height={36} src={item?.image} />
        </Box>
        <Box ml={3}>
          <Box>{item?.name}</Box>
          <Box>
            {item.balance} - ${item?.currency}
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        height={35}
        borderRadius={10}
        bgcolor="#F3F2F8"
      >
        <Typography style={{ padding: "10px" }}>
          ${item.balance * item?.currency}
        </Typography>
      </Box>
    </Box>
  );
};
export default TokenItem;
