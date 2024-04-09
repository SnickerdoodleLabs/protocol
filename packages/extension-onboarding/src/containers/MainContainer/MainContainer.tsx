import Router from "@extension-onboarding/containers/Router";
import { AccountLinkingContextProvider } from "@extension-onboarding/context/AccountLinkingContext";
import { AnalyticsContextProvider } from "@extension-onboarding/context/AnalyticsContext";
import { AppContextProvider } from "@extension-onboarding/context/App";
import { DataWalletContextProvider } from "@extension-onboarding/context/DataWalletContext";
import { LayoutProvider } from "@extension-onboarding/context/LayoutContext";
import { NotificationContextProvider } from "@extension-onboarding/context/NotificationContext";
import { ThemeContextProvider } from "@extension-onboarding/context/ThemeContext";
import WalletKits from "@extension-onboarding/context/WalletKits";
import { ISdlDataWallet } from "@snickerdoodlelabs/objects";
import React from "react";

interface IMainContainerProps {
  proxy?: ISdlDataWallet;
}

const MainContainer: React.FC<IMainContainerProps> = ({ proxy }) => {
  return (
    <ThemeContextProvider>
      <AnalyticsContextProvider disabled={!!proxy}>
        <DataWalletContextProvider proxy={proxy}>
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
