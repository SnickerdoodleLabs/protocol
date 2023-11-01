import { Box, Button, Typography } from "@material-ui/core";
import { PurchasedProduct } from "@snickerdoodlelabs/objects";
import React, { FC, memo } from "react";

import { useStyles } from "../Amazon.style";

import ConnectionCheckIcon from "@extension-onboarding/assets/icons/shoppingdata-connectdone.png";
import SyncDataIcon from "@extension-onboarding/assets/icons/syncdataicon.png";

interface IAmazonDisConnectItemProps {
  icon: string;
  providerName: string;
  handleDisconnectClick: () => void;
  product: PurchasedProduct[];
}

export const AmazonDisConnectItem: FC<IAmazonDisConnectItemProps> = memo(
  ({
    icon,
    providerName,
    handleDisconnectClick,
    product,
  }: IAmazonDisConnectItemProps) => {
    const classes = useStyles();
    const dateCreatedArray = product.map((product) => {
      const unixTimestamp = product.dateCreated;
      const date = new Date(unixTimestamp * 1000);
      const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      };
      return date.toLocaleDateString("en-US", options);
    });

    const lastUpdate = dateCreatedArray.reduce((oldestDate, currentDate) => {
      const currentDateTimestamp = new Date(currentDate).getTime();
      const oldestDateTimestamp = new Date(oldestDate).getTime();
      return currentDateTimestamp < oldestDateTimestamp
        ? currentDate
        : oldestDate;
    }, dateCreatedArray[0]);

    return (
      <>
        <Box className={classes.logoProviderNameContainer}>
          <Box>
            <img className={classes.LogoImage} src={icon} />
          </Box>
          <Box>
            <Typography className={classes.providerName}>
              {providerName}
            </Typography>
          </Box>
        </Box>
        <Box className={classes.logoProviderNameContainer}>
          <img
            className={classes.connectionCheckIcon}
            src={ConnectionCheckIcon}
          />
          <Box>
            <Typography className={classes.connected}>Connected</Typography>
          </Box>
        </Box>
        <Box>
          <Typography className={classes.lastUpdated}>
            Last Updated on {lastUpdate}
          </Typography>
        </Box>
        <Box>
          {/*  <Button
            className={classes.SyncDataButton}
            endIcon={
              <img className={classes.syncDataIcon} src={SyncDataIcon} />
            }
          >
            Sync Data
          </Button> */}
          <Button className={classes.Button} onClick={handleDisconnectClick}>
            Disconnect
          </Button>
        </Box>
      </>
    );
  },
);
