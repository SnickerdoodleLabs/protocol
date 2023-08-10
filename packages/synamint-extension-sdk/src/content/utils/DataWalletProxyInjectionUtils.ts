import Browser from "webextension-polyfill";
class DataWalletProxyInjectionUtils {
  public static inject(providerKey: string) {
    const ID = Browser.runtime.id;
    try {
      const node = document.head || document.documentElement;
      const oldProvider = document.getElementById(`sdl-data-wallet-${ID}`);
      oldProvider?.parentNode?.removeChild?.(oldProvider);
      const script = document.createElement("script");
      script.setAttribute("id", `sdl-data-wallet-${ID}`);
      script.setAttribute(
        "src",
        Browser.runtime.getURL("dataWalletProxy.bundle.js") +
          "?id=" +
          ID +
          "&providerKey=" +
          providerKey,
      );
      node.appendChild(script);
      DataWalletProxyInjectionUtils._notify();
    } catch (e) {
      console.error("dataWalletProxy injection failed", e);
    }
  }
  private static _notify() {
    document.dispatchEvent(new CustomEvent("SD_WALLET_EXTENSION_CONNECTED"));
  }
}

export default DataWalletProxyInjectionUtils;
