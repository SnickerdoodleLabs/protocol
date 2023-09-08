import { Box, Button, Grid, Typography } from "@material-ui/core";
import React, { FC, memo } from "react";

import AmazonLogo from "@extension-onboarding/assets/images/amazon-logo.png";
import { useStyles } from "@extension-onboarding/pages/Details/screens/ShoppingData/Platforms/Amazon/Amazon.style";

export const Amazon = memo(() => {
  const handleConnectClick = () => {
    // Redirect to Amazon login page
    window.location.href =
      "https://www.amazon.com/ap/signin?openid.pape.max_auth_age=900&openid.return_to=https%3A%2F%2Fwww.amazon.com%2Fgp%2Fyourstore%2Fhome%3Fpath%3D%252Fgp%252Fyourstore%252Fhome%26useRedirectOnSuccess%3D1%26signIn%3D1%26action%3Dsign-out%26ref_%3Dnav_AccountFlyout_signout&openid.assoc_handle=usflex&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0";
  };
  const classes = useStyles();
  return (
    <Box pt={3} className={classes.container}>
      <Box className={classes.logoProviderNameContainer}>
        <Box>
          <img className={classes.LogoImage} src={AmazonLogo} />
        </Box>
        <Box>
          <Typography className={classes.providerName}>Amazon</Typography>
        </Box>
      </Box>
      <Box>
        <Button className={classes.Button} onClick={handleConnectClick}>
          Connect
        </Button>
      </Box>
    </Box>
  );
});
