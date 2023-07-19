import { Box } from "@material-ui/core";
import React, { FC } from "react";
import Browser from "webextension-polyfill";

import { useStyles } from "@browser-extension/popup/components/Header/Header.style";

const Header: FC = () => {
  const classes = useStyles();

  return (
    <Box pt={3} pb={1} pl={3}>
      <img
        className={classes.logo}
        src={Browser.runtime.getURL("assets/img/sdHorizontalLogo.svg")}
      />
    </Box>
  );
};

export default Header;
