import { Box, Typography, Dialog, Button } from "@material-ui/core";
import React from "react";
import Browser from "webextension-polyfill";

import { LinkCard } from "@synamint-extension-sdk/content/components/LinkCard/LinkCard";
import { useStyles } from "@synamint-extension-sdk/content/components/Screens/ShoppingDataDone/ShoppingDataDone.style";
import {
  PRIVACY_POLICY_URL,
  SPA_PATHS,
  WEBSITE_URL,
} from "@synamint-extension-sdk/content/constants";

interface IShoppingDataDoneProps {
  coreGateway;
}

export const SOCIAL_LINKS = [
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

export const ShoppingDataDone: React.FC<IShoppingDataDoneProps> = ({
  coreGateway,
}: IShoppingDataDoneProps) => {
  const classes = useStyles();
  const navigateShoppingData = () => {
    console.log(coreGateway);
    coreGateway.getConfig().map((config) => {
      console.log(config);
      window.open(`${config.onboardingUrl}${SPA_PATHS.shoppingData}`, "_blank");
    });
  };
  return (
    <Box width={445} bgcolor="#FFFFFF" className={classes.container}>
      <Box pl={4} py={3}>
        <img
          height={23}
          src="https://storage.googleapis.com/dw-assets/extension/sdl-horizontal-logo.svg"
        />
      </Box>
      <Box px={3}>
        <Box mt={2}>
          <Typography className={classes.title}>Congratulations!</Typography>
        </Box>
        <Box mt={3} width={396}>
          <Typography className={classes.subText}>
            Your Amazon data successfully added to your Data Wallet.
          </Typography>
        </Box>
        <Box mt={1}>
          <LinkCard
            navigateTo={SPA_PATHS.dataPermissions}
            icon={Browser.runtime.getURL("assets/icons/permissions.svg")}
            title="Data Permmissions"
            coreGateway={coreGateway}
          />
          <LinkCard
            navigateTo={SPA_PATHS.dashboard}
            icon={Browser.runtime.getURL("assets/icons/dashboard.svg")}
            title="My Data Dashboard"
            coreGateway={coreGateway}
          />
          <LinkCard
            navigateTo={SPA_PATHS.settings}
            icon={Browser.runtime.getURL("assets/icons/settings.svg")}
            title="Settings"
            coreGateway={coreGateway}
          />
        </Box>
        <Box mt={3}>
          <Button
            onClick={navigateShoppingData}
            fullWidth
            className={classes.button}
          >
            Go to Shopping Data
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
        mt={2}
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
