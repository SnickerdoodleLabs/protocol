import { Box, Typography } from "@material-ui/core";
import React from "react";
import Browser from "webextension-polyfill";

import { useStyles } from "@synamint-extension-sdk/content/components/ShoppingDataService/components/LinkCard/LinkCard.style";
import { ExternalCoreGateway } from "@synamint-extension-sdk/gateways";

interface ILinkCardProps {
  navigateTo: string;
  icon: string;
  title: string;
  coreGateway: ExternalCoreGateway;
}
export const LinkCard = ({
  navigateTo,
  icon,
  title,
  coreGateway,
}: ILinkCardProps) => {
  const classes = useStyles();
  const navigate = () => {
    console.log(coreGateway);
    coreGateway.getConfig().map((config) => {
      console.log(config);
      window.open(`${config.onboardingURL}${navigateTo}`, "_blank");
    });
  };
  return (
    <Box
      onClick={navigate}
      mt={2}
      display="flex"
      alignItems="center"
      bgcolor="#2E2946"
      className={classes.container}
    >
      <Box mx={2}>
        <img src={icon} />
      </Box>
      <Typography className={classes.linkTitle}>{title}</Typography>
    </Box>
  );
};
