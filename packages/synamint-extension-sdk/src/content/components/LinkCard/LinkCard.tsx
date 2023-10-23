import { Box, Typography } from "@material-ui/core";
import React from "react";
import Browser from "webextension-polyfill";

import { useStyles } from "@synamint-extension-sdk/content/components/LinkCard/LinkCard.style";
import { ExternalCoreGateway } from "@synamint-extension-sdk/gateways";

interface ILinkCardProps {
  navigateTo: string;
  icon: string;
  title: string;
}
const LinkCard = ({ navigateTo, icon, title }: ILinkCardProps) => {
  let coreGateway: ExternalCoreGateway;
  const classes = useStyles();
  const navigate = () => {
    console.log(coreGateway);
    coreGateway.getConfig().map((config) => {
      console.log(config);
      window.open(`${config.onboardingUrl}${navigateTo}`, "_blank");
      console.log(navigateTo);
    });
  };
  return (
    <Box
      onClick={navigate}
      mt={2}
      display="flex"
      alignItems="center"
      className={classes.container}
    >
      <Box mx={2}>
        <img src={icon} />
      </Box>

      <Typography className={classes.linkTitle}>{title}</Typography>
      <Box mr={2} marginLeft="auto">
        <img src={Browser.runtime.getURL("assets/icons/arrow.svg")} />
      </Box>
    </Box>
  );
};

export default LinkCard;
