import Footer from "@extension-onboarding/components/v2/Footer";
import NavigationBar from "@extension-onboarding/components/v2/NavigationBar";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { authFlowRouteSettings } from "@extension-onboarding/containers/Router/Router.settings";
import React, { useEffect, useMemo } from "react";
import { matchPath, Outlet, useLocation, useNavigate } from "react-router-dom";
const AutFlowLayout = () => {
  // TODO remove below code when extension navigations fixed
  const SCREENS_OBJ = {
    portfolio: EPaths.HOME,
    rewards: EPaths.MARKETPLACE,
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
    const originalPath = Object.values(EPaths).find((path) =>
      matchPath(path, pathname),
    );
    return (
      authFlowRouteSettings[originalPath as EPaths] ?? {
        bgColor: "#FAFAFA",
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
    <>
      <NavigationBar />
      <Outlet />
      <Footer />
    </>
  );
};

export default AutFlowLayout;
