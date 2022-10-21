import { Box, Typography } from "@material-ui/core";
import { TokenBalance } from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import React, { FC } from "react";

import defaultToken from "@extension-onboarding/assets/icons/default-token.png";
import { tokenInfoObj } from "@extension-onboarding/constants/tokenInfo";
interface ITokenItemProps {
  item: TokenBalance;
}

const TokenItem: FC<ITokenItemProps> = ({ item }) => {
  return (
    <Box display="flex" pl={0.75} alignItems="center" py={1}>
      <img
        width={36}
        height={36}
        src={tokenInfoObj[item.ticker]?.iconSrc ?? defaultToken}
      />
      <Box ml={3}>
        <Box>
          <Typography
            style={{
              fontFamily: "Space Grotesk",
              fontWeight: 500,
              fontSize: 16,
              color: "#5D5A74",
            }}
          >
            {tokenInfoObj[item.ticker]?.displayName ?? item?.ticker}
          </Typography>
        </Box>
        <Box>
          <Typography
            style={{
              fontFamily: "Space Grotesk",
              fontWeight: 500,
              fontSize: 12,
              color: "#5D5A74",
              opacity: 0.6,
            }}
          >
            {ethers.utils.formatUnits(item.balance)} {item.ticker}
          </Typography>
        </Box>
      </Box>

      <Box
        marginLeft="auto"
        px={1}
        display="flex"
        alignItems="center"
        height={28}
        borderRadius={10}
        bgcolor="#F3F2F8"
      >
        <Typography
          style={{
            fontFamily: "Space Grotesk",
            fontWeight: 500,
            fontSize: 16,
            color: "#5D5A74",
            padding: "10px",
          }}
        >
          ${Number.parseFloat(item.quoteBalance).toFixed(1)}
        </Typography>
      </Box>
    </Box>
  );
};
export default TokenItem;
