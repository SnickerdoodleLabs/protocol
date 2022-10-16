import React, { FC } from "react";
import { Box } from "@material-ui/core";
import { useStyles } from "@app/Popup/components/Header/Header.style";
import Browser from "webextension-polyfill";

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
