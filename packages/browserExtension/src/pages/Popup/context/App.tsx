import { InternalCoreGateway } from "pages/coreGateways";
import React, { FC, useContext, useState, useEffect } from "react";
import { EPortNames, PORT_NOTIFICATION } from "@shared/constants/ports";
import Browser from "webextension-polyfill";
import { createBackgroundConnectors } from "@utils";
import { closeCurrenTab } from "@shared/utils/extensionUtils";

const portName = !window.location.hash
  ? EPortNames.SD_POPUP
  : window.location.hash.includes("notification")
  ? EPortNames.SD_NOTIFICATION
  : EPortNames.SD_FULL_SCREEN;

const port = Browser.runtime.connect({
  name: portName,
});

let coreGateway: InternalCoreGateway;
let notificationEmitter;

const connectors = createBackgroundConnectors(port);
if (connectors.isOk()) {
  coreGateway = new InternalCoreGateway(connectors.value.rpcEngine);
  notificationEmitter = connectors.value.streamMiddleware.events;
}

interface IAppContext {
  closeCurrentTab: () => void;
  coreGateway: InternalCoreGateway;
  windowType: EPortNames;
  appState: any;
}

const AppContext = React.createContext<IAppContext>({} as IAppContext);

export const AppContextProvider: FC = ({ children }) => {
  const [appState, setAppState] = useState<any>("");
  useEffect(() => {
    getInitialState();
    subscribeNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getInitialState = () => {
    coreGateway.getState().map((state) => {
      return setAppState(state);
    });
  };

  const subscribeNotifications = () => {
    notificationEmitter.on(PORT_NOTIFICATION, handleNotification);
  };
  // TODO add notification types
  const handleNotification = (notification: any) => {
    switch (notification.type) {
      case "state_update":
        setAppState(notification.data);
        break;
      default:
        console.log("notification", notification.data);
    }
  };

  return (
    <AppContext.Provider
      value={{
        closeCurrentTab:
          portName !== EPortNames.SD_POPUP ? closeCurrenTab : () => {},
        coreGateway,
        windowType: portName,
        appState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
