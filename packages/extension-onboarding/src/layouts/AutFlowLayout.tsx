import CampaignPopup from "@extension-onboarding/components/Modals/CampaignPopup/CampaignPopup";
import Sidebar from "@extension-onboarding/components/Sidebar";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { authFlowRouteSettings } from "@extension-onboarding/containers/Router/Router.settings";
import { Box } from "@material-ui/core";
import React, { useEffect, useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const AutFlowLayout = () => {
  // TODO remove below code when extension navigations fixed
  const SCREENS_OBJ = {
    portfolio: EPaths.HOME,
    rewards: EPaths.MY_REWARDS,
    settings: EPaths.WEB3_SETTINGS,
  };
  const { search, pathname, state } = useLocation();
  const screen = new URLSearchParams(search).get("screen");
  const navigate = useNavigate();

  useEffect(() => {
    if (screen != undefined && SCREENS_OBJ[screen] != undefined) {
      navigate(SCREENS_OBJ[screen], { replace: true });
    }
  }, []);

  const { hideSidebar, bgColor, removeDefaultPadding } = useMemo(() => {
    return (
      authFlowRouteSettings[pathname as EPaths] ?? {
        bgColor: "#fff",
        hideSidebar: false,
        removeDefaultPadding: false,
      }
    );
  }, [pathname]);

  useEffect(() => {
    const wrapper = document.getElementById("authflow");
    if (wrapper) {
      wrapper.scrollTop = 0;
    }
  }, [pathname, JSON.stringify(search), JSON.stringify(state)]);

  return (
    <Box display="flex" overflow="hidden" height="100vh">
      {!hideSidebar && <Sidebar />}
      <CampaignPopup />
      <Box
        id="authflow"
        display="flex"
        bgcolor={bgColor}
        style={{ overflowY: "auto" }}
        p={removeDefaultPadding ? 0 : 6}
        flex={1}
        flexDirection="column"
      >
        <Box mb={4}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AutFlowLayout;
