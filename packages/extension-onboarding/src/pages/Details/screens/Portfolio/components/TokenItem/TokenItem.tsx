import { Box, Typography } from "@material-ui/core";
import React, { FC } from "react";
import { ethers } from "ethers";
import { IEVMBalance } from "@snickerdoodlelabs/objects";
import avaxCircle from "@extension-onboarding/assets/images/avax-circle.png";
import polygonCircle from "@extension-onboarding/assets/images/polygon-circle.png";
import ethereumIcon from "@extension-onboarding/assets/icons/ethereum-icon.svg";
import avalancheIcon from "@extension-onboarding/assets/icons/avalanche-icon.svg";
import polygonIcon from "@extension-onboarding/assets/icons/polygon-icon.svg";
import ethereumCircle from "@extension-onboarding/assets/icons/ethereum-circle.svg";
import usdcCircle from "@extension-onboarding/assets/icons/usdc-circle.png";
import defaultToken from "@extension-onboarding/assets/icons/default-token.png";
interface ITokenItemProps {
  item: IEVMBalance;
}

const TokenItem: FC<ITokenItemProps> = ({ item }) => {
  const getImage = (ticker) => {
    switch (ticker) {
      case "ETH":
        return ethereumCircle;
      case "AVAX":
        return avaxCircle;
      case "USDC":
        return usdcCircle;
      case "MATIC":
        return polygonIcon;
      default:
        return defaultToken;
    }
  };

  const getTokenName = (ticker) => {
    switch (ticker) {
      case "ETH":
        return "Ethereum";
      case "AVAX":
        return "AVAX";
      case "USDC":
        return "USDC";
      case "MATIC":
        return "Polygon";
      default:
        return "";
    }
  };
  return (
    <Box display="flex" justifyContent="space-between">
      <Box display="flex">
        <Box ml={1}>
          <img width={36} height={36} src={getImage(item.ticker)} />
        </Box>
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
              {getTokenName(item.ticker) ?? item?.ticker}
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
      </Box>
      <Box
        display="flex"
        alignItems="center"
        height={35}
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
          ${item.quoteBalance}
        </Typography>
      </Box>
    </Box>
  );
};
export default TokenItem;
