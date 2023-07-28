import {
  ISdlDataWalletProxy,
  IWindowWithSdlDataWallet,
} from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { ISdlDataWallet } from "@snickerdoodlelabs/objects";
import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
  useRef,
  useMemo,
} from "react";

declare const window: IWindowWithSdlDataWallet;

interface IDataWalletContext {
  sdlDataWallet: ISdlDataWallet;
}

enum ESetupStatus {
  WAITING,
  WAITING_PROVIDER_SELECTION,
  FAILED,
  SUCCESS,
}

const DataWalletContext = createContext<IDataWalletContext>(
  {} as IDataWalletContext,
);

export const DataWalletContextProvider: FC = ({ children }) => {
  const [sdlDataWallet, setSdlDataWallet] = React.useState<ISdlDataWallet>(
    {} as ISdlDataWallet,
  );
  const [setupStatus, setSetupStatus] = useState<ESetupStatus>(
    ESetupStatus.WAITING,
  );
  const [isInitialTimeoutExpired, setIsInitialTimeoutExpired] = useState(false);
  const [connectedEventCount, setConnectedEventCount] = useState(0);
  const [waiting, setWaiting] = useState(false);

  const onExtensionWalletConnected = useCallback(() => {
    if (initialTimeoutRef.current.value !== null) {
      clearTimeout(initialTimeoutRef.current.value);
    }
    setConnectedEventCount((prev) => prev + 1);
    // wait for multiple connected events to be fired
    setWaiting(true);
  }, []);

  const initialTimeoutRef = useRef<{ value: NodeJS.Timeout | null }>({
    value: null,
  });
  const waitTimerRunning = useRef(false);
  const connectedEventCountRef = useRef(connectedEventCount);

  useEffect(() => {
    connectedEventCountRef.current = connectedEventCount;
  }, [connectedEventCount]);

  useEffect(() => {
    // initial timeout to wait for extension to connect
    initialTimeoutRef.current.value = setTimeout(() => {
      setIsInitialTimeoutExpired(true);
    }, 4000);

    // add extension connected event listener
    document.addEventListener(
      "SD_WALLET_EXTENSION_CONNECTED",
      onExtensionWalletConnected,
    );

    return () => {
      if (initialTimeoutRef.current.value !== null) {
        clearTimeout(initialTimeoutRef.current.value);
      }
      document.removeEventListener(
        "SD_WALLET_EXTENSION_CONNECTED",
        onExtensionWalletConnected,
      );
    };
  }, []);

  useEffect(() => {
    if (isInitialTimeoutExpired) {
      // remove extension connected event listener
      document.removeEventListener(
        "SD_WALLET_EXTENSION_CONNECTED",
        onExtensionWalletConnected,
      );
      // not failed used as a placeholder for now
      // try to initialize the data wallet via web integration
      setSetupStatus(ESetupStatus.FAILED);
    }
  }, [isInitialTimeoutExpired]);

  useEffect(() => {
    if (waiting && !waitTimerRunning.current) {
      // Set the wait timer running state to true to avoid multiple timers
      waitTimerRunning.current = true;
      // After 2 seconds, check the connectedEventCount
      setTimeout(() => {
        if (connectedEventCountRef.current === 1) {
          // Only one connected event was fired in given time
          // This means that there is only one data wallet proxy connected
          // We can now set the data wallet
          const dataWallet = window.sdlDataWallet;
          setSdlDataWallet(dataWallet);
        } else {
          // Multiple connected events were fired
          // This means that there are multiple data wallet proxy instances connected
          // now should be prompted to select a data wallet provider
          setSetupStatus(ESetupStatus.WAITING_PROVIDER_SELECTION);
        }

        // Remove the event listener after the 2 seconds wait
        document.removeEventListener(
          "SD_WALLET_EXTENSION_CONNECTED",
          onExtensionWalletConnected,
        );
        // Reset the waiting state to false
        waitTimerRunning.current = false;
        setWaiting(false);
      }, 2000);
    }
    return () => {};
  }, [waiting]);

  useEffect(() => {
    // not a fan of this kind of check but to deceive the context provider it is useful
    // check if there is an actual provider
    if (JSON.stringify(sdlDataWallet) !== "{}") {
      setSetupStatus(ESetupStatus.SUCCESS);
    }
  }, [JSON.stringify(sdlDataWallet)]);

  const render = useMemo(() => {
    switch (setupStatus) {
      case ESetupStatus.WAITING:
        return <div>Waiting</div>;
      case ESetupStatus.WAITING_PROVIDER_SELECTION:
        return (
          <div>
            <ProviderSelector
              onProviderSelect={(provider) => {
                setSdlDataWallet(provider);
              }}
            />
          </div>
        );
      case ESetupStatus.FAILED:
        return <div>Failed</div>;
      case ESetupStatus.SUCCESS:
        return children;
      default:
        return <>DEFAULT</>;
    }
  }, [setupStatus]);

  return (
    <DataWalletContext.Provider value={{ sdlDataWallet }}>
      {render}
    </DataWalletContext.Provider>
  );
};

export const useDataWalletContext = () => useContext(DataWalletContext);

interface IProviderSelectorProps {
  onProviderSelect: (provider: ISdlDataWalletProxy) => void;
}
const ProviderSelector: FC<IProviderSelectorProps> = ({ onProviderSelect }) => {
  const providerList = useMemo(() => {
    // actually there is no master provider
    // let's just assume the first injected provider is the master provider
    const masterProvider = window.sdlDataWallet;
    const subProviders = masterProvider.providers;
    return [masterProvider, ...(subProviders || [])];
  }, []);
  return (
    <>
      {providerList.map((provider) => (
        <div
          key={provider.extensionId}
          onClick={() => {
            onProviderSelect(provider);
          }}
        >
          {provider.name}
        </div>
      ))}
    </>
  );
};
