import Router from "@extension-onboarding/containers/Router";
import { AccountLinkingContextProvider } from "@extension-onboarding/context/AccountLinkingContext";
import { AnalyticsContextProvider } from "@extension-onboarding/context/AnalyticsContext";
import { AppContextProvider } from "@extension-onboarding/context/App";
import { DataWalletContextProvider } from "@extension-onboarding/context/DataWalletContext";
import { LayoutProvider } from "@extension-onboarding/context/LayoutContext";
import { NotificationContextProvider } from "@extension-onboarding/context/NotificationContext";
import { ThemeContextProvider } from "@extension-onboarding/context/ThemeContext";
import { WalletProvider } from "@suiet/wallet-kit";
import React from "react";

const MainContainer: React.FC = () => {
  return (
    <ThemeContextProvider>
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
    </ThemeContextProvider>
  );
};

export default MainContainer;
