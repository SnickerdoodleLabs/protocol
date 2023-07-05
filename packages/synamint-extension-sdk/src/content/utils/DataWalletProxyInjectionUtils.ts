import Browser from "webextension-polyfill";
class DataWalletProxyInjectionUtils {
  public static inject() {
    try {
      const node = document.head || document.documentElement;
      const oldProvider = document.getElementById("sdl-wallet");
      oldProvider?.parentNode?.removeChild?.(oldProvider);
      const script = document.createElement("script");
      script.setAttribute("id", "sdl-wallet");
      script.setAttribute(
        "src",
        Browser.runtime.getURL("dataWalletProxy.bundle.js"),
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
