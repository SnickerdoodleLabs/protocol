import Router from "@extension-onboarding/containers/Router";
import { AccountLinkingContextProvider } from "@extension-onboarding/context/AccountLinkingContext";
import { AnalyticsContextProvider } from "@extension-onboarding/context/AnalyticsContext";
import { AppContextProvider } from "@extension-onboarding/context/App";
import { DataWalletContextProvider } from "@extension-onboarding/context/DataWalletContext";
import { LayoutProvider } from "@extension-onboarding/context/LayoutContext";
import { NotificationContextProvider } from "@extension-onboarding/context/NotificationContext";
import { ThemeContextProvider } from "@extension-onboarding/context/ThemeContext";
import WalletKits from "@extension-onboarding/context/WalletKits";
import React from "react";

const MainContainer: React.FC = () => {
  return (
    <ThemeContextProvider>
      <AnalyticsContextProvider>
        <DataWalletContextProvider>
          <NotificationContextProvider>
            <AppContextProvider>
              <LayoutProvider>
                <WalletKits>
                  <AccountLinkingContextProvider>
                    <Router />
                  </AccountLinkingContextProvider>
                </WalletKits>
              </LayoutProvider>
            </AppContextProvider>
          </NotificationContextProvider>
        </DataWalletContextProvider>
      </AnalyticsContextProvider>
    </ThemeContextProvider>
  );
};

export default MainContainer;
