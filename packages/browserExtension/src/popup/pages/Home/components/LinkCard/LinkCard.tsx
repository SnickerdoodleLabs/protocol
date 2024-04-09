import { useAppContext } from "@browser-extension/popup/context";
import { useStyles } from "@browser-extension/popup/pages/Home/components/LinkCard/LinkCard.style";
import { Box, Typography } from "@material-ui/core";
import React from "react";

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

export default LinkCard;
