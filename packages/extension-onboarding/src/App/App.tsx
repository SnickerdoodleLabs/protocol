import { Button, Grid, LinearProgress } from "@material-ui/core";
import React, { FC, useEffect, useMemo, useState } from "react";
import {
  getProviderList,
  IProvider,
} from "@extension-onboarding/services/providers";
import BuildYourProfile from "@browser-extension/pages/BuildYourProfile/BuildYourProfile";
import Onboarding from "@browser-extension/pages/Onboarding";
import { ProviderContext } from "@browser-extension/Context/ProviderContext";

const App: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [providerList, setProviderList] = useState<IProvider[]>([]);
  const [installedProviders, setInstalledProviders] = useState<IProvider[]>([]);
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  useEffect(() => {
    document.addEventListener(
      "SD_WALLET_EXTENSION_CONNECTED",
      onWalletConnected,
    );
  }, []);

  useEffect(() => {
    if (isLoading === false) {
      document.dispatchEvent(new CustomEvent("SD_ONBOARDING_SPA_CONNECTED"));
      document.removeEventListener(
        "SD_WALLET_EXTENSION_CONNECTED",
        onWalletConnected,
      );
    }
  }, [isLoading]);

  const onWalletConnected = () => {
    // Phantom wallet can not initiate window phantom object at time
    setTimeout(() => {
      const providerList = getProviderList();
      console.log("ProviderList", providerList);
      providerList.map((list) => {
        if (list.provider.isInstalled && list.key != "walletConnect") {
          setInstalledProviders((old) => [...old, list]);
        }
      });
      setProviderList(providerList);
      setIsLoading(false);
    }, 500);
  };

  // @ts-ignore
  const providerValue = useMemo(() => ({
    providerList,
    installedProviders,
    linkedAccounts,
    setLinkedAccounts,
  }));

  return (
    // @ts-ignore
    <ProviderContext.Provider value={providerValue}>
      <Onboarding />
    </ProviderContext.Provider>
  );

  {
    /*
  return (
    <>
      {isLoading ? (
        <LinearProgress />
      ) : (
        <>
          {providerList.map((providerObj) => {
            return (
              <React.Fragment key={providerObj.name}>
                <Button onClick={() => onClickConnect(providerObj)}>
                  <img src={providerObj.icon} />
                  {providerObj.name}
                </Button>
              </React.Fragment>
            );
          })}
        </>
      )}
    </>
  );
*/
  }
};

export default App;
