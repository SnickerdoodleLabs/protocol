import { DataWalletProxy } from "@synamint-extension-sdk/content/DataWalletProxy";

export const inject = () => {
  Object.defineProperty(window, "sdlDataWallet", {
    enumerable: false,
    writable: false,
    configurable: false,
    value: DataWalletProxy,
  });
};

inject();
