import { Box, Typography, Collapse } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import clsx from "clsx";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import portfolioIcon from "@extension-onboarding/assets/icons/portfolio.svg";
import rewardsIcon from "@extension-onboarding/assets/icons/rewards.svg";
import settingsIcon from "@extension-onboarding/assets/icons/settings.svg";
import snickerDoodleLogo from "@extension-onboarding/assets/icons/snickerdoodleLogo.svg";
import sdlLogoSafe from "@extension-onboarding/assets/images/sdl-logo-safe.svg";
import LinkAccountModal from "@extension-onboarding/components/Modals/LinkAccountModal";
import { useStyles } from "@extension-onboarding/components/Topbar/Menu/Menu.style";
import {
  FAQ_URL,
  HOTJAR_DISCLAIMER_URL,
  PRIVACY_POLICY_URL,
  SURVEY_URL,
  TERMS_OF_SERVICE_URL,
  ZENDEKS_URL,
} from "@extension-onboarding/constants";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { useAccountLinkingContext } from "@extension-onboarding/context/AccountLinkingContext";
import { useAppContext } from "@extension-onboarding/context/App";

export interface ISubroute {
  title: string;
  path: EPaths;
}
export interface IRoute {
  icon: string;
  title: string;
  path: EPaths | null;
  subroutes: ISubroute[] | null;
}

export const routes: IRoute[] = [
  // {
  //   icon: rewardsIcon,
  //   title: "Rewards Marketplace",
  //   path: EPaths.MY_REWARDS,
  //   subroutes: null,
  // },
  {
    icon: rewardsIcon,
    title: "Rewards Marketplace",
    path: EPaths.MARKETPLACE,
    subroutes: null,
  },
  {
    icon: portfolioIcon,
    title: "My Data Dashboard",
    path: null,
    subroutes: [
      { path: EPaths.TOKENS, title: "Tokens" },
      { path: EPaths.NFTS, title: "NFTs" },
      { path: EPaths.POAP_NFTS, title: "POAPs" },
      { path: EPaths.BROWSER_ACTIVITY, title: "Browser Activity" },
      { path: EPaths.SOCIAL_MEDIA_DATA, title: "Social Media Data" },
      // { path: EPaths.PERSONAL_INFO, title: "Personal Info" },
    ],
  },
  {
    icon: settingsIcon,
    title: "Settings",
    path: null,
    subroutes: [
      { title: "Crypto Accounts", path: EPaths.WEB3_SETTINGS },
      { title: "Personal Info", path: EPaths.WEB2_SETTINGS },
      { title: "Rewards Subscriptions", path: EPaths.REWARDS_SUBSCRIPTIONS },
      { title: "Storage Settings", path: EPaths.STORAGE_SETTINGS },
    ],
  },
];

const Menu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const classes = useStyles();
  const [lastClickedIndex, setLastClickedIndex] = useState<number>();
  const { setLinkerModalOpen } = useAppContext();

  return (
    <>
      <Box display="flex" flexDirection="column" className={classes.container}>
        <Box
          onClick={setLinkerModalOpen}
          className={classes.button}
          mt={1.5}
          minHeight={48}
          height={48}
          borderRadius={8}
          display="flex"
          width="185px"
          bgcolor="#5A5292"
          color="#F2F4F7"
          alignItems="center"
          justifyContent="center"
          id="sb-link-account"
        >
          <Box display="flex" mr={1}>
            <AddIcon className={classes.linkAccountButtonIcon} />
          </Box>
          <Typography className={classes.linkAccountButtonText}>
            Link Account
          </Typography>
        </Box>
        <Box mt={3} display="flex" flexDirection="column" width="100%">
          {routes.map((route, index) => {
            const subroutes = route.subroutes;
            const isActive =
              route.path === location.pathname ||
              (route.subroutes ? route.subroutes : []).findIndex(
                (subroute) => subroute.path === location.pathname,
              ) > -1;
            const isHighlighted =
              route.path && location.pathname.includes(route.path);
            return (
              <Box key={index} mb={2} display="flex" flexDirection="column">
                <Box
                  id={`sb-${index}`}
                  onClick={() => {
                    if (route.path) {
                      navigate(route.path);
                    } else {
                      if (route.subroutes) {
                        navigate(route.subroutes[0].path);
                      }
                    }
                    setLastClickedIndex(index);
                  }}
                  borderRadius={8}
                  py={1}
                  px={1.5}
                  display="flex"
                  alignItems="center"
                  {...((isActive || isHighlighted) && { bgcolor: "#DAD8E9" })}
                  className={classes.routeWrapper}
                >
                  {/* <Box display="flex" mr={1.5}>
                    <img className={classes.mainRouteIcon} src={route.icon} />
                  </Box> */}
                  <Typography className={clsx(classes.routeText)}>
                    {route.title}
                  </Typography>
                  {subroutes?.length && (
                    <Box display="flex" marginLeft="auto">
                      <ExpandMoreIcon />
                    </Box>
                  )}
                </Box>
                {subroutes && (
                  <Collapse in={isActive || lastClickedIndex === index}>
                    <Box
                      mt={1}
                      ml={2.5}
                      borderColor="#DAD8E9"
                      px={3}
                      py={1}
                      borderLeft="1px solid"
                      display="flex"
                      flexDirection="column"
                    >
                      {subroutes.map((subroute, subrouteIndex) => {
                        return (
                          <Box
                            className={classes.routeWrapper}
                            key={`${index}-${subrouteIndex}`}
                            onClick={() => {
                              navigate(subroute.path);
                              setLastClickedIndex(index);
                            }}
                            mb={subrouteIndex === subroutes.length - 1 ? 0 : 2}
                          >
                            <Typography
                              className={clsx(classes.routeText, {
                                [classes.textActive]:
                                  subroute.path === location.pathname,
                              })}
                            >
                              {subroute.title}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Collapse>
                )}
              </Box>
            );
          })}
        </Box>
        <Box alignSelf="flex-start" mb={1.5} display="flex">
          <Typography
            onClick={() => {
              window.open(SURVEY_URL, "_blank");
            }}
            className={classes.link}
          >
            Survey
          </Typography>
        </Box>
        <Box mb={1.5} width="100%" justifyContent="flex-start">
          <Typography
            className={classes.link}
            onClick={() => {
              window.open(ZENDEKS_URL, "_blank");
            }}
          >
            Contact Us
          </Typography>
        </Box>
        <Box mb={1.5} width="100%" justifyContent="flex-start">
          <Typography
            className={classes.link}
            onClick={() => {
              window.open(FAQ_URL, "_blank");
            }}
          >
            FAQ
          </Typography>
        </Box>
        <Box pb={1.5} width="100%" justifyContent="flex-start">
          <Typography
            className={classes.link}
            onClick={() => {
              window.open(PRIVACY_POLICY_URL, "_blank");
            }}
          >
            Privacy Policy
          </Typography>
        </Box>
        <Box pb={1.5} width="100%" justifyContent="flex-start">
          <Typography
            className={classes.link}
            onClick={() => {
              window.open(HOTJAR_DISCLAIMER_URL, "_blank");
            }}
          >
            Hotjar Disclaimer
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default Menu;
