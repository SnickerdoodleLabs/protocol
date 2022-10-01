import { Box, Typography } from "@material-ui/core";
import { EVMBalance } from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import React, { FC } from "react";

import ethereumCircle from "@extension-onboarding/assets/icons/ethereum-circle.svg";
import usdcCircle from "@extension-onboarding/assets/icons/usdc-circle.png";
import avaxCircle from "@extension-onboarding/assets/images/avax-circle.png";
import { useStyles } from "@extension-onboarding/components/BalanceItem/BalanceItem.style";

export interface IBalanceItemProps {
  item: EVMBalance;
  currency?: number;
}

const BalanceItem: FC<IBalanceItemProps> = ({
  item,
  currency = 0,
}: IBalanceItemProps) => {
  const classes = useStyles();
  const getImage = () => {
    switch (item.ticker) {
      case "ETH":
        return ethereumCircle;
      case "AVAX":
        return avaxCircle;
      case "USDC":
        return usdcCircle;
      default:
        return usdcCircle;
    }
  };

  const getTokenName = () => {
    switch (item.ticker) {
      case "ETH":
        return "Ethereum";
      case "AVAX":
        return "AVAX";
      case "USDC":
        return "USDC";
      default:
        return "";
    }
  };
  return (
    <Box display="flex" mt={4} position="relative">
      <Box>
        <img className={classes.icon} src={getImage()} />
      </Box>
      <Box ml={2} mt={0.5}>
        <Typography className={classes.name}>{getTokenName()}</Typography>
        <Typography className={classes.balance}>
          {ethers.utils.formatUnits(item.balance)} {item.ticker} - ${currency}
        </Typography>
      </Box>
      <Box className={classes.usdBalanceWrapper}>
        <Typography className={classes.usdBalance}>
          $
          {(
            parseFloat(ethers.utils.formatUnits(item.balance)) * currency
          ).toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
};
export default BalanceItem;
