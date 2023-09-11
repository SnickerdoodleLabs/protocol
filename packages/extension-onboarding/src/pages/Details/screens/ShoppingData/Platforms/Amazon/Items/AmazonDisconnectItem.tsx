import { Box, Button, Typography } from "@material-ui/core";
import React, { FC, memo } from "react";

import { useStyles } from "../Amazon.style";

import ConnectionCheckIcon from "@extension-onboarding/assets/icons/shoppingdata-connectdone.png";
import SyncDataIcon from "@extension-onboarding/assets/icons/syncdataicon.png";

interface IAmazonDisConnectItemProps {
  icon: string;
  providerName: string;
  handleDisconnectClick: () => void;
}

export const AmazonDisConnectItem: FC<IAmazonDisConnectItemProps> = memo(
  ({
    icon,
    providerName,
    handleDisconnectClick,
  }: IAmazonDisConnectItemProps) => {
    const classes = useStyles();
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
            Last Updated on 23 August 16:42
          </Typography>
        </Box>
        <Box>
          <Button
            className={classes.SyncDataButton}
            endIcon={
              <img className={classes.syncDataIcon} src={SyncDataIcon} />
            }
          >
            Sync Data
          </Button>
          <Button className={classes.Button} onClick={handleDisconnectClick}>
            Disconnect
          </Button>
        </Box>
      </>
    );
  },
);
