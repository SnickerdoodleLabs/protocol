import { WebIntegrationConfigProvider } from "@extension-onboarding/services/implementations/utilities";
import { ISdlDataWalletProxy } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import Loading from "@extension-onboarding/setupScreens/Loading";
import { PasskeyUtils } from "@extension-onboarding/utils";
import { ECoreProxyType, ISdlDataWallet } from "@snickerdoodlelabs/objects";
import { SnickerdoodleWebIntegration } from "@snickerdoodlelabs/web-integration";
import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  lazy,
  Suspense,
} from "react";

const LazyInstallationRequired = lazy(
  () => import("@extension-onboarding/setupScreens/InstallationRequired"),
);
const LazyProviderSelector = lazy(
  () => import("@extension-onboarding/setupScreens/ProviderSelector"),
);

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

interface IDataWalletContextProviderProps {
  proxy?: ISdlDataWallet;
}

export const DataWalletContextProvider: FC<IDataWalletContextProviderProps> = ({
  children,
  proxy,
}) => {
  const [sdlDataWallet, setSdlDataWallet] = React.useState<ISdlDataWallet>(
    undefined as unknown as ISdlDataWallet,
  );
  const [setupStatus, setSetupStatus] = useState<ESetupStatus>(
    ESetupStatus.WAITING,
  );

  useEffect(() => {
    initialize();
  }, []);

  const initialize = useCallback(() => {
    if (proxy) {
      return setSdlDataWallet(proxy);
    }
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
        return setSdlDataWallet(sdlDataWallet);
      })
      .map(() => {
        console.log("CHARLIE creating passkey");
        const passkeyUtils = new PasskeyUtils();
        passkeyUtils
          .createDIDSession("CHARLIE")
          .map((didSession) => {
            console.log("CHARLIE created did", didSession);
          })
          .mapErr((e) => {
            console.log("CHARLIE error creating DID", e);
          });
      })
      .mapErr((err) => {
        return setSetupStatus(ESetupStatus.FAILED);
      });
  }, [proxy]);

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

  useEffect(() => {
    // not a fan of this kind of check but to deceive the context provider it is useful
    // check if there is an actual provider
    if (sdlDataWallet) {
      setSetupStatus(ESetupStatus.SUCCESS);
    }
  }, [sdlDataWallet]);

  const render = useMemo(() => {
    switch (setupStatus) {
      case ESetupStatus.WAITING:
        return <Loading />;
      case ESetupStatus.WAITING_PROVIDER_SELECTION:
        return (
          <Suspense fallback={<Loading />}>
            <LazyProviderSelector
              onProviderSelect={(provider) => {
                setSdlDataWallet(provider);
              }}
            />
          </Suspense>
        );
      case ESetupStatus.FAILED:
        return (
          <Suspense fallback={<Loading />}>
            <LazyInstallationRequired />
          </Suspense>
        );
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
