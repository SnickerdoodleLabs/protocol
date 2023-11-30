import { Box, Button, Typography } from "@material-ui/core";
import { PurchasedProduct } from "@snickerdoodlelabs/objects";
import { SDButton, SDTypography } from "@snickerdoodlelabs/shared-components";
import React, { FC, memo } from "react";

import ConnectionCheckIcon from "@extension-onboarding/assets/icons/shoppingdata-connectdone.png";
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
        <Box display="flex" alignItems="center">
          <Box>
            <img width={47} height={41} src={icon} />
          </Box>
          <Box ml={2}>
            <SDTypography fontWeight="bold" variant="titleLg">
              {providerName}
            </SDTypography>
          </Box>
        </Box>
        <Box display={{ xs: "none", sm: "flex" }} alignItems="center">
          <img width={17} height={13} src={ConnectionCheckIcon} />
          <Box ml={1}>
            <SDTypography
              fontWeight="medium"
              variant="bodyLg"
              fontFamily="roboto"
              color="textSuccess"
            >
              Connected
            </SDTypography>
          </Box>
        </Box>
        <Box display={{ xs: "none", sm: "block" }}>
          <SDTypography
            fontWeight="regular"
            variant="bodySm"
            fontFamily="publicSans"
            color="textBody"
          >
            Last Updated on {lastUpdate}
          </SDTypography>
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
          <SDButton onClick={handleDisconnectClick}>Disconnect</SDButton>
        </Box>
      </>
    );
  },
);
