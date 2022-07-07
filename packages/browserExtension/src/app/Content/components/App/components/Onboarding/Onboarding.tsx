import { ExtensionDisplayUtils } from "@shared/utils/ExtensionDisplayUtils";
import React, { useEffect, FC, useCallback } from "react";
import Browser from "webextension-polyfill";
import { ExternalCoreGateway } from "@app/coreGateways";
import {
  EVMAccountAddress,
  LanguageCode,
  Signature,
} from "@snickerdoodlelabs/objects";

interface IOnboardingProps {
  coreGateway: ExternalCoreGateway;
}

const Onboarding: FC<IOnboardingProps> = (props) => {
  useEffect(() => {
    notifyOnboardingSPA();
  }, []);

  document.addEventListener("SD_ONBOARDING_SPA_CONNECTED", () => {});
  interface IAddAccountEvent {
    detail: { account: EVMAccountAddress; signature: Signature };
  }
  const onAccountConnected = useCallback(
    async (event) => {
      const {
        detail: { account, signature },
      } = event as unknown as IAddAccountEvent;
      await props.coreGateway
        .addAccount(account, signature, LanguageCode("en"))
        .map((res) => console.log(res));
    },
    [props.coreGateway],
  );

  useEffect(() => {
    document.addEventListener(
      "SD_ONBOARDING_ACCOUNT_ADDED",
      onAccountConnected,
    );

    return () => {
      document.removeEventListener(
        "SD_ONBOARDING_ACCOUNT_ADDED",
        onAccountConnected,
      );
    };
  }, [onAccountConnected]);

  const notifyOnboardingSPA = () => {
    if ("https://localhost:9005/" === window.location.href) {
      document.dispatchEvent(new CustomEvent("SD_WALLET_EXTENSION_CONNECTED"));
    }
  };

  return null;
};

export default Onboarding;
