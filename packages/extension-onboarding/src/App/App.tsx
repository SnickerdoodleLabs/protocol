import { Button, LinearProgress } from "@material-ui/core";
import React, { FC, useEffect, useState } from "react";
import {
  getProviderList,
  IProvider,
} from "@extension-onboarding/services/providers";
import { EVMAccountAddress } from "@snickerdoodlelabs/objects";

const App: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [providerList, setProviderList] = useState<IProvider[]>([]);
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
      setProviderList(providerList);
      setIsLoading(false);
    }, 500);
  };

  const onClickConnect = (providerObj: IProvider) => {
    if (!providerObj.provider.isInstalled) {
      return window.open(providerObj.installationUrl, "_blank");
    }

    return providerObj.provider.connect().andThen((account) => {
      return providerObj.provider.getSignature("abc").map((signature) => {
        console.log(signature);
        document.dispatchEvent(
          new CustomEvent("SD_ONBOARDING_ACCOUNT_ADDED", {
            detail: {
              account,
              signature,
            },
          }),
        );
      });
    });
  };

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
};

export default App;
