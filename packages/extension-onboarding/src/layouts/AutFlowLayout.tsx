import { Box } from "@material-ui/core";
import React, { useEffect } from "react";
import Sidebar from "@extension-onboarding/components/Sidebar";
import CampaignPopup from "@extension-onboarding/components/Modals/CampaignPopup/CampaignPopup";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";


const AutFlowLayout = () => {
  // TODO remove below code when extension navigations fixed
  const SCREENS_OBJ = {
    portfolio: EPaths.HOME,
    rewards: EPaths.MY_REWARDS,
    settings: EPaths.WEB3_SETTINGS,
  };
  const { search } = useLocation();
  const screen = new URLSearchParams(search).get("screen");
  const navigate = useNavigate();

  useEffect(() => {
    if (screen != undefined && SCREENS_OBJ[screen] != undefined) {
      navigate(SCREENS_OBJ[screen], { replace: true });
    }
  }, []);

  return (
    <Box display="flex" maxHeight="100vh" >
      <Sidebar />
      <CampaignPopup />
      <Box
        display="flex"
        style={{ overflowY: "auto" }}
        p={6}
        flex={1}
        flexDirection="column"
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AutFlowLayout;
