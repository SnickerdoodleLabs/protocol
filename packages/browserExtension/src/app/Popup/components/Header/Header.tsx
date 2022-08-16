import React, { FC } from "react";
import { Box } from "@material-ui/core";
import { useStyles } from "@app/Popup/components/Header/Header.style";
import Browser from "webextension-polyfill";

const Header: FC = () => {
  const classes = useStyles();

  return (
    <Box className={classes.container} py={4} pl={5}>
      <img className={classes.logo} src={Browser.runtime.getURL("assets/img/sdHorizontalLogo.svg")} />
    </Box>
  );
};

export default Header;
