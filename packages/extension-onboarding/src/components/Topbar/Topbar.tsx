import { Box, IconButton } from "@material-ui/core";
import React, { useState } from "react";

import CloseIcon from "@extension-onboarding/assets/icons/topbarclose-icon.png";
import MenuIcon from "@extension-onboarding/assets/icons/topbarmenu-icon.png";
import snickerDoodleLogo from "@extension-onboarding/assets/icons/topbarSdLogo.png";
import Menu from "@extension-onboarding/components/Topbar/Menu/index";
import { useStyles } from "@extension-onboarding/components/Topbar/Topbar.style";

const Topbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const classes = useStyles();

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Box className={classes.topbar} padding={2}>
      <img src={snickerDoodleLogo} className={classes.logoImage} />

      <IconButton onClick={handleMenuClick} edge="start" color="inherit">
        <Box className={classes.menuButton}>
          {isMenuOpen ? (
            <img src={CloseIcon} className={classes.menuIcon} />
          ) : (
            <img src={MenuIcon} className={classes.menuIcon} />
          )}
        </Box>
      </IconButton>

      {isMenuOpen && (
        <Box className={classes.menuContainer}>
          <Menu />
        </Box>
      )}
    </Box>
  );
};

export default Topbar;
