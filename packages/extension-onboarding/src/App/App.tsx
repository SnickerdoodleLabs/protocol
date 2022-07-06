import { Button, LinearProgress } from "@material-ui/core";
import React, { FC, useEffect, useState } from "react";
import {
  MetamaskWalletProvider,
  WalletConnectProvider,
} from "@extension-onboarding/services/providers/connectors";

const App: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <LinearProgress />
      ) : (
        <>
          <Button
            onClick={async () => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              const provider = new WalletConnectProvider();
              const result = await provider.connect();
              let _account;
              if (result.isOk()) {
                console.log(result);
                result.map((account) => {
                  _account = account;
                });
              }
              provider
                .getSignature()
                .map((signature) => console.log(signature));
              // document.dispatchEvent(
              //   new CustomEvent("SD_SPA_ACCOUNT_CONNECTED", {
              //     detail: { _account, connector: "metamask" },
              //   }),
              // );
            }}
          >
            Connect Metamask
          </Button>
          <p>connected</p>
        </>
      )}
    </>
  );
};

export default App;
