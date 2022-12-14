import campaignIcon from "@extension-onboarding/assets/icons/campaign.svg";
import portfolioIcon from "@extension-onboarding/assets/icons/portfolio.svg";
import rewardsIcon from "@extension-onboarding/assets/icons/rewards.svg";
import settingsIcon from "@extension-onboarding/assets/icons/settings.svg";
import snickerDoodleLogo from "@extension-onboarding/assets/icons/snickerdoodleLogo.svg";
import LinkAccountModal from "@extension-onboarding/components/Modals/LinkAccountModal";
import { useStyles } from "@extension-onboarding/components/Sidebar/Sidebar.style";
import {
  PRIVACY_POLICY_URL,
  ZENDEKS_URL,
} from "@extension-onboarding/constants";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { Box, Typography, Collapse } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import clsx from "clsx";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
  {
    icon: portfolioIcon,
    title: "My Data Dashboard",
    path: EPaths.HOME,
    subroutes: [
      { path: EPaths.REWARDS, title: "Rewards" },
      { path: EPaths.TOKENS, title: "Tokens" },
      { path: EPaths.NFTS, title: "NFTs" },
      { path: EPaths.BROWSER_ACTIVITY, title: "Browser Activity" },
      { path: EPaths.PERSONAL_INFO, title: "Personal Info" },
    ],
  },
  {
    icon: rewardsIcon,
    title: "Rewards MarketPlace",
    path: EPaths.MY_REWARDS,
    subroutes: null,
  },
  // {
  //   icon: campaignIcon,
  //   title: "Campaigns",
  //   path: null,
  //   subroutes: [
  //     { title: "My Campaigns", path: EPaths.MY_CAMPAIGNS },
  //     { title: "Available Campaigns", path: EPaths.MARKETPLACE_CAMPAIGNS },
  //   ],
  // },
  {
    icon: settingsIcon,
    title: "Data Settings",
    path: null,
    subroutes: [
      { title: "Web 3 Info", path: EPaths.WEB3_SETTINGS },
      { title: "Web 2 Info", path: EPaths.WEB2_SETTINGS },
      { title: "Data Permissions", path: EPaths.DATA_PERMISSIONS_SETTING },
      { title: "Scam Filter", path: EPaths.SCAM_FILTER_SETTINGS },
    ],
  },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const classes = useStyles();
  const [lastClickedIndex, setLastClickedIndex] = useState<number>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      {isModalOpen && (
        <LinkAccountModal
          closeModal={() => {
            setIsModalOpen(false);
          }}
        />
      )}
      <Box display="flex" flexDirection="column" className={classes.container}>
        <Box mt={4.5}>
          <img src={snickerDoodleLogo} />
        </Box>
        <Box
          onClick={() => {
            setIsModalOpen(true);
          }}
          className={classes.button}
          mt={6}
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
            Link account
          </Typography>
        </Box>
        <Box mt={6} display="flex" flexDirection="column" width="100%">
          {routes.map((route, index) => {
            const subroutes = route.subroutes;
            const isActive =
              route.path === location.pathname ||
              (route.subroutes ? route.subroutes : []).findIndex(
                (subroute) => subroute.path === location.pathname,
              ) > -1;
            return (
              <Box
                key={index}
                mb={2}
                mx={2}
                display="flex"
                flexDirection="column"
              >
                <Box
                  id={`sb-${index}`}
                  onClick={() => {
                    if (route.path) {
                      navigate(route.path);
                    }
                    setLastClickedIndex(index);
                  }}
                  borderRadius={8}
                  py={1}
                  px={1.5}
                  display="flex"
                  alignItems="center"
                  {...(isActive && { bgcolor: "#DAD8E9" })}
                  className={classes.routeWrapper}
                >
                  {/* <Box display="flex" mr={1.5}>
                    <img className={classes.mainRouteIcon} src={route.icon} />
                  </Box> */}
                  <Typography
                    className={clsx(classes.mainRouteText, {
                      [classes.textActive]: isActive,
                    })}
                  >
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
                      {subroutes.map((subroute, index) => {
                        return (
                          <Box
                            className={classes.routeWrapper}
                            key={index}
                            onClick={() => {
                              navigate(subroute.path);
                            }}
                            mb={index === subroutes.length - 1 ? 0 : 3}
                          >
                            <Typography
                              className={clsx(classes.subrouteText, {
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
        <Box alignSelf="flex-start" marginTop="auto" mb={3.5} display="flex">
          <Typography
            onClick={() => {
              window.open(ZENDEKS_URL, "_blank");
            }}
            className={classes.link}
          >
            Contact with Us
          </Typography>
        </Box>
        <Box pb={2.5} width="100%" justifyContent="flex-start">
          <Typography
            className={classes.link}
            onClick={() => {
              window.open(PRIVACY_POLICY_URL, "_blank");
            }}
          >
            Privacy Policy
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default Sidebar;
