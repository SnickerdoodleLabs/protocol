import { useAppContext } from "@browser-extension/popup/context";
import { useStyles } from "@browser-extension/popup/pages/Home/components/LinkCard/LinkCard.style";
import { Box, Typography } from "@material-ui/core";
import React from "react";
import Browser from "webextension-polyfill";
interface ILinkCardProps {
  navigateTo: string;
  icon: string;
  title: string;
}
const LinkCard = ({ navigateTo, icon, title }: ILinkCardProps) => {
  const { coreGateway } = useAppContext();
  const classes = useStyles();
  const navigate = () => {
    coreGateway.getConfig().map((config) => {
      window.open(`${config.onboardingUrl}${navigateTo}`, "_blank");
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
