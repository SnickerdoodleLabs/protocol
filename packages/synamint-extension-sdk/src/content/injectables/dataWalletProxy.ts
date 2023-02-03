import DataWalletProxy from "@synamint-extension-sdk/content/DataWalletProxy";

Object.defineProperty(window, "sdlDataWallet", {
  enumerable: false,
  writable: false,
  configurable: false,
  value: DataWalletProxy,
});
