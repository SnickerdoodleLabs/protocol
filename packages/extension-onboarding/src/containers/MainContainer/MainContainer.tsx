import React from "react";

import Router from "@extension-onboarding/containers/Router";
import { AccountLinkingContextProvider } from "@extension-onboarding/context/AccountLinkingContext";
import { AnalyticsContextProvider } from "@extension-onboarding/context/AnalyticsContext";
import { AppContextProvider } from "@extension-onboarding/context/App";
import { LayoutProvider } from "@extension-onboarding/context/LayoutContext";
import { NotificationContextProvider } from "@extension-onboarding/context/NotificationContext";
import { DataWalletContextProvider } from "@extension-onboarding/context/DataWalletContext";
import { WalletProvider } from "@suiet/wallet-kit";
const MainContainer: React.FC = () => {
  return (
    <AnalyticsContextProvider>
      <DataWalletContextProvider>
        <NotificationContextProvider>
          <AppContextProvider>
            <LayoutProvider>
              <WalletProvider autoConnect={false}>
                <AccountLinkingContextProvider>
                  <Router />
                </AccountLinkingContextProvider>
              </WalletProvider>
            </LayoutProvider>
          </AppContextProvider>
        </NotificationContextProvider>
      </DataWalletContextProvider>
    </AnalyticsContextProvider>
  );
};

export default MainContainer;
