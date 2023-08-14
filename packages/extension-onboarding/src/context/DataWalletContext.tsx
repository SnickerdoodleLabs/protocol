import "reflect-metadata";
import useIsMobile from "@extension-onboarding/hooks/useIsMobile";
import { WebIntegrationConfigProvider } from "@extension-onboarding/services/implementations/utilities";
import { ISdlDataWalletProxy } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import InstallationRequired from "@extension-onboarding/setupScreens/InstallationRequired";
import Loading from "@extension-onboarding/setupScreens/Loading";
import MobileScreen from "@extension-onboarding/setupScreens/MobileScreen/MobileScreen";
import ProviderSelector from "@extension-onboarding/setupScreens/ProviderSelector";
import { ECoreProxyType, ISdlDataWallet } from "@snickerdoodlelabs/objects";
import { SnickerdoodleWebIntegration } from "@snickerdoodlelabs/web-integration";
import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";

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
  const isMobile = useIsMobile();
  const [sdlDataWallet, setSdlDataWallet] = React.useState<ISdlDataWallet>(
    undefined as unknown as ISdlDataWallet,
  );
  const [setupStatus, setSetupStatus] = useState<ESetupStatus>(
    ESetupStatus.WAITING,
  );

  useEffect(() => {
    initialize();
  }, []);

  const initialize = () => {
    const webIntegrationConfig = new WebIntegrationConfigProvider().getConfig();
    const webIntegration = new SnickerdoodleWebIntegration(
      webIntegrationConfig,
      null,
    );
    return webIntegration
      .initialize()
      .map((sdlDataWallet) => {
        if (sdlDataWallet.proxyType === ECoreProxyType.EXTENSION_INJECTED) {
          return waitAndInitializeExtensionInjectedProxy(sdlDataWallet);
        }
        return waitAndInitializeIframeInjectedProxy(sdlDataWallet);
      })
      .mapErr((err) => {
        return setSetupStatus(ESetupStatus.FAILED);
      });
  };

  const waitAndInitializeExtensionInjectedProxy = (
    proxy: ISdlDataWalletProxy,
  ) => {
    // give extra time for other providers to be injected
    setTimeout(() => {
      if ((proxy.providers?.length || 0) > 0) {
        setSetupStatus(ESetupStatus.WAITING_PROVIDER_SELECTION);
      } else {
        setSdlDataWallet(proxy);
      }
    }, 500);
  };

  const waitAndInitializeIframeInjectedProxy = (proxy: ISdlDataWallet) => {
    // give extra time for iframe unlock the wallet;
    // once we remove crumbs it will be instant
    setTimeout(() => {
      setSdlDataWallet(proxy);
    }, 2000);
  };

  useEffect(() => {
    // not a fan of this kind of check but to deceive the context provider it is useful
    // check if there is an actual provider
    if (sdlDataWallet) {
      setSetupStatus(ESetupStatus.SUCCESS);
    }
  }, [sdlDataWallet]);

  const render = useMemo(() => {
    if (isMobile) return <MobileScreen />;
    switch (setupStatus) {
      case ESetupStatus.WAITING:
        return <Loading />;
      case ESetupStatus.WAITING_PROVIDER_SELECTION:
        return (
          <ProviderSelector
            onProviderSelect={(provider) => {
              setSdlDataWallet(provider);
            }}
          />
        );
      case ESetupStatus.FAILED:
        return <InstallationRequired />;
      case ESetupStatus.SUCCESS:
        return children;
      default:
        return <>DEFAULT</>;
    }
  }, [setupStatus, isMobile]);

  return (
    <DataWalletContext.Provider value={{ sdlDataWallet }}>
      {render}
    </DataWalletContext.Provider>
  );
};

export const useDataWalletContext = () => useContext(DataWalletContext);
