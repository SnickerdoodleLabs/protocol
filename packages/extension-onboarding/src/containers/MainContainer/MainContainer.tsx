import Router from "@extension-onboarding/containers/Router";
import { AccountLinkingContextProvider } from "@extension-onboarding/context/AccountLinkingContext";
import { AnalyticsContextProvider } from "@extension-onboarding/context/AnalyticsContext";
import { AppContextProvider } from "@extension-onboarding/context/App";
import { LayoutProvider } from "@extension-onboarding/context/LayoutContext";
import { NotificationContextProvider } from "@extension-onboarding/context/NotificationContext";
import React from "react";

const MainContainer: React.FC = () => {
  return (
    <AnalyticsContextProvider>
      <NotificationContextProvider>
        <AppContextProvider>
          <LayoutProvider>
            <AccountLinkingContextProvider>
              <Router />
            </AccountLinkingContextProvider>
          </LayoutProvider>
        </AppContextProvider>
      </NotificationContextProvider>
    </AnalyticsContextProvider>
  );
};

export default MainContainer;
