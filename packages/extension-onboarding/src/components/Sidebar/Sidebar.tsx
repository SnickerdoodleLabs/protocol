import snickerDoodleLogo from "@extension-onboarding/assets/icons/snickerdoodleLogo.svg";
import { useStyles } from "@extension-onboarding/components/Sidebar/Sidebar.style";
import {
  routes,
  useAuthFlowRouteContext,
} from "@extension-onboarding/context/AuthFlowRouteContext";
import { Box, Typography, Collapse } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import clsx from "clsx";
import React, { useState } from "react";
import LinkAccountModal from "../Modals/LinkAccountModal";

const Sidebar = () => {
  const classes = useStyles();
  const [lastClickedIndex, setLastClickedIndex] = useState<number>();
  const { activeScreen, setActiveScreen } = useAuthFlowRouteContext();
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
          mt={6}
          height={48}
          borderRadius={8}
          display="flex"
          width="185px"
          bgcolor="#5A5292"
          color="#F2F4F7"
          alignItems="center"
          justifyContent="center"
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
              route.screen === activeScreen ||
              (route.subroutes ? route.subroutes : []).findIndex(
                (subroute) => subroute.screen === activeScreen,
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
                  onClick={() => {
                    if (route.screen) {
                      setActiveScreen(route.screen);
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
                  <Box display="flex" mr={1.5}>
                    <img className={classes.mainRouteIcon} src={route.icon} />
                  </Box>
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
                              setActiveScreen(subroute.screen);
                            }}
                            mb={index === subroutes.length - 1 ? 0 : 3}
                          >
                            <Typography
                              className={clsx(classes.subrouteText, {
                                [classes.textActive]:
                                  subroute.screen === activeScreen,
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
      </Box>
    </>
  );
};

export default Sidebar;
