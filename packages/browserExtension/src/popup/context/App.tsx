import { ExtensionUtils } from "@snickerdoodlelabs/synamint-extension-sdk/extensionShared";
import { InternalCoreGateway } from "@snickerdoodlelabs/synamint-extension-sdk/gateways";
import { BackgroundConnector } from "@snickerdoodlelabs/synamint-extension-sdk/port";
import {
  PORT_NOTIFICATION,
  EPortNames,
  // AccountInitializedNotification,
  // ENotificationTypes,
  IInternalState,
} from "@snickerdoodlelabs/synamint-extension-sdk/shared";
import React, { FC, useContext, useState, useEffect } from "react";

const portName = !window.location.hash
  ? EPortNames.SD_POPUP
  : window.location.hash.includes("notification")
  ? EPortNames.SD_NOTIFICATION
  : EPortNames.SD_FULL_SCREEN;

const { coreGateway, notificationEmitter } = new BackgroundConnector(
  portName,
).getConnectors();

interface IAppContext {
  appState: IInternalState | null | undefined;
  closeCurrentTab: () => void;
  coreGateway: InternalCoreGateway;
  windowType: EPortNames;
  initialized: boolean;
}

const AppContext = React.createContext<IAppContext>({} as IAppContext);

export const AppContextProvider: FC = ({ children }) => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [appState, setAppState] = useState<IInternalState | null>();
  useEffect(() => {
    getInitialState();
    // subscribeNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (appState && initialized === false) {
      setInitialized(true);
    }
  }, [JSON.stringify(appState), initialized]);

  const getInitialState = () => {
    coreGateway.getState().map((state: IInternalState) => {
      setAppState(state);
    });
  };

  // const subscribeNotifications = () => {
  //   notificationEmitter.on(PORT_NOTIFICATION, handleNotification);
  // };

  // const handleNotification = (notification: AccountInitializedNotification) => {
  //   switch (notification.type) {
  //     case ENotificationTypes.ACCOUNT_INITIALIZED:
  //       setAppState((prev) => ({
  //         ...prev,
  //         dataWalletAddress: notification.data.dataWalletAddress,
  //       }));
  //       break;
  //     default:
  //       console.log("notification", notification.data);
  //   }
  // };

  return (
    <AppContext.Provider
      value={{
        closeCurrentTab:
          portName !== EPortNames.SD_POPUP
            ? ExtensionUtils.closeCurrenTab
            : () => {},
        coreGateway,
        windowType: portName,
        appState,
        initialized,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
