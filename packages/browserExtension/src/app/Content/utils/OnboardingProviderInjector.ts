import Browser from "webextension-polyfill";
export class OnboardingProviderInjector {
  public static inject() {
    try {
      const node = document.head || document.documentElement;
      const oldProvider = document.getElementById("sdl-wallet");
      oldProvider?.parentNode?.removeChild?.(oldProvider);
      const script = document.createElement("script");
      script.setAttribute("id", "sdl-wallet");
      script.setAttribute(
        "src",
        Browser.runtime.getURL("injectables/onboarding.bundle.js"),
      );
      node.appendChild(script);
      OnboardingProviderInjector._notify();
    } catch (e) {
      console.error("sdlDataWallet onboarding provider injection failed", e);
    }
  }
  private static _notify() {
    document.dispatchEvent(new CustomEvent("SD_WALLET_EXTENSION_CONNECTED"));
  }
}
