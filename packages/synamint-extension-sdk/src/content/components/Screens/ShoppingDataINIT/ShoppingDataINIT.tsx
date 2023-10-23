import { Box, Typography, Dialog, Button } from "@material-ui/core";
import React, { useMemo, useState } from "react";
import Browser from "webextension-polyfill";

import { useStyles } from "@synamint-extension-sdk/content/components/Screens/ShoppingDataINIT/ShoppingDataINIT.style";
import {
  PRIVACY_POLICY_URL,
  WEBSITE_URL,
} from "@synamint-extension-sdk/content/constants";

interface IShoppingDataINITProps {
  setShoppingDataScrapeStart;
}

const SOCIAL_LINKS = [
  {
    iconSrc: Browser.runtime.getURL("assets/icons/twitter.svg"),
    url: "https://twitter.com/yosnickerdoodle",
  },
  {
    iconSrc: Browser.runtime.getURL("assets/icons/linkedin.svg"),
    url: "https://www.linkedin.com/company/snickerdoodlelabs/",
  },
  {
    iconSrc: Browser.runtime.getURL("assets/icons/instagram.svg"),
    url: "https://www.instagram.com/yosnickerdoodle/",
  },
  {
    iconSrc: Browser.runtime.getURL("assets/icons/facebook.svg"),
    url: "https://www.facebook.com/profile.php?id=100068000334616",
  },
];

const ShoppingDataINIT: React.FC<IShoppingDataINITProps> = ({
  setShoppingDataScrapeStart,
}: IShoppingDataINITProps) => {
  const classes = useStyles();

  return (
    <Box width={445} bgcolor="#FFFFFF" className={classes.container}>
      <Box pl={4} py={3}>
        <img
          height={23}
          src="https://storage.googleapis.com/dw-assets/extension/sdl-horizontal-logo.svg"
        />
      </Box>
      <Box py={4} px={3}>
        <Box>
          <Typography className={classes.title}>
            Add Your Amazon Data to Your Profile
          </Typography>
        </Box>
        <Box mt={3}>
          <Box>
            <Typography className={classes.bodyText}>
              Your data is anonymized, so you cannot be identified.
            </Typography>
          </Box>
          <Box mt={1.5}>
            <Typography className={classes.bodyText}>
              The more data you consent to lease, the more rewards you'll earn.
              It's always your choice.
            </Typography>
          </Box>
        </Box>
        <Box mt={3}>
          <Button
            className={classes.button}
            fullWidth
            onClick={() => setShoppingDataScrapeStart(true)}
          >
            Get Started
          </Button>
        </Box>
      </Box>
      <Box
        bgcolor="#DAD8E9"
        display="flex"
        flexDirection="column"
        marginTop="auto"
        px={4}
        pt={3}
        pb={1.5}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            className={classes.link}
            onClick={() => {
              window.open(PRIVACY_POLICY_URL, "_blank");
            }}
          >
            Privacy Policy
          </Typography>
          <Typography
            className={classes.url}
            onClick={() => {
              window.open(WEBSITE_URL, "_blank");
            }}
          >
            snickerdoodle.com
          </Typography>
        </Box>

        <Box
          mt={1}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            className={classes.link}
            onClick={() => {
              window.open(PRIVACY_POLICY_URL, "_blank");
            }}
          >
            Terms of Service
          </Typography>
          <Box mb={0.5} display="flex">
            {SOCIAL_LINKS.map((link, index) => {
              return (
                <Box
                  ml={0.5}
                  className={classes.socialButtonWrapper}
                  onClick={() => {
                    window.open(link.url, "_blank");
                  }}
                  key={index}
                >
                  <img src={link.iconSrc} />
                </Box>
              );
            })}
          </Box>
        </Box>
        <img
          className={classes.copyrightLogo}
          src={Browser.runtime.getURL("assets/img/copyright.svg")}
        />
      </Box>
    </Box>
  );
};

export default ShoppingDataINIT;
