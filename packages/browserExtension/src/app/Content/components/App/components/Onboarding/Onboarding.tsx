import { ExtensionDisplayUtils } from "@shared/utils/ExtensionDisplayUtils";
import React, { useEffect } from "react";
import Browser from "webextension-polyfill";

const Onboarding = () => {
  useEffect(() => {
    notifyOnboardingSPA();
  }, []);

  document.addEventListener("SD_ONBOARDING_SPA_CONNECTED", () => {});

  document.addEventListener("SD_ONBOARDING_ACCOUNT_ADDED", (event) => {
    // @ts-ignore
    console.log("Content Script", event.detail);
  });

  const notifyOnboardingSPA = () => {
    if ("https://localhost:9005/" === window.location.href) {
      document.dispatchEvent(new CustomEvent("SD_WALLET_EXTENSION_CONNECTED"));
    }
  };

  return null;
};

export default Onboarding;
