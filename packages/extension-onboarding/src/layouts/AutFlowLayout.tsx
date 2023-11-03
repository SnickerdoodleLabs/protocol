import Footer from "@extension-onboarding/components/v2/Footer";
import NavigationBar from "@extension-onboarding/components/v2/NavigationBar";
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
const AutFlowLayout = () => {
  const { search, pathname, state } = useLocation();

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
