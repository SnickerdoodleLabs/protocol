import React, { memo, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { useAnalyticsContext } from "@extension-onboarding/context/AnalyticsContext";

const RootRouteLayout = () => {
  const location = useLocation();
  const { sendPageView } = useAnalyticsContext();
  useEffect(() => {
    sendPageView();
  }, [location]);

  return <Outlet />;
};

export default memo(RootRouteLayout);
