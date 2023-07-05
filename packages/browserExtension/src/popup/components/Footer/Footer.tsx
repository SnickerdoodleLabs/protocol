import { useStyles } from "@browser-extension/popup/components/Footer/Footer.style";
import { PRIVACY_POLICY_URL, WEBSITE_URL } from "@browser-extension/popup/constants";
import { Box, Typography } from "@material-ui/core";
import React, { FC } from "react";
import Browser from "webextension-polyfill";

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

const Footer: FC = () => {
  const classes = useStyles();

  return (
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
  );
};

export default Footer;
