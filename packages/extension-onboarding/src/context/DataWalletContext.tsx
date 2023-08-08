import {
  ISdlDataWalletProxy,
  IWindowWithSdlDataWallet,
} from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import {
  ECoreProxyType,
  ISdlDataWallet,
  URLString,
} from "@snickerdoodlelabs/objects";
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
import "reflect-metadata";
import { SnickerdoodleWebIntegration } from "@snickerdoodlelabs/web-integration";

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

  useEffect(() => {
    initialize();
  }, []);

  const initialize = () => {
    const webIntegration = new SnickerdoodleWebIntegration(
      {
        primaryInfuraKey: "",
        iframeURL: URLString("http://localhost:9010"),
        debug: true,
      },
      null,
    );
    return webIntegration
      .initialize()
      .map((sdlDataWallet) => {
        if (sdlDataWallet.proxyType === ECoreProxyType.EXTENSION_INJECTED) {
          if (
            ((sdlDataWallet as ISdlDataWalletProxy).providers?.length || 0) > 1
          ) {
            return setSetupStatus(ESetupStatus.WAITING_PROVIDER_SELECTION);
          }
        }
        return setSdlDataWallet(sdlDataWallet);
      })
      .mapErr((err) => {
        return setSetupStatus(ESetupStatus.FAILED);
      });
  };

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
