import Router from "@extension-onboarding/containers/Router";
import { AccountLinkingContextProvider } from "@extension-onboarding/context/AccountLinkingContext";
import { AppContextProvider } from "@extension-onboarding/context/App";
import { LayoutProvider } from "@extension-onboarding/context/LayoutContext";
import { NotificationContextProvider } from "@extension-onboarding/context/NotificationContext";
import React from "react";

const MainContainer: React.FC = () => {
  return (
    <NotificationContextProvider>
      <AppContextProvider>
        <LayoutProvider>
          <AccountLinkingContextProvider>
            <Router />
          </AccountLinkingContextProvider>
        </LayoutProvider>
      </AppContextProvider>
    </NotificationContextProvider>
  );
};

export default MainContainer;
