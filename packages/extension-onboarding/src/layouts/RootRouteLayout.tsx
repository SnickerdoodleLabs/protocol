import { useAnalyticsContext } from "@extension-onboarding/context/AnalyticsContext";
import React, { memo, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

const RootRouteLayout = () => {
  const location = useLocation();
  const { sendPageView } = useAnalyticsContext();
  useEffect(() => {
    window.scrollTo(0, 0);
    sendPageView();
  }, [location.pathname]);

  return <Outlet />;
};

export default memo(RootRouteLayout);
