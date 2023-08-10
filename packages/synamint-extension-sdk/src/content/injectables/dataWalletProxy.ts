import { _DataWalletProxy } from "@synamint-extension-sdk/content/DataWalletProxy";

declare const window: Record<string, any>;

const currentScript: HTMLScriptElement =
  document.currentScript as HTMLScriptElement;
const queryParams = new URLSearchParams(new URL(currentScript.src).search);
const appID = queryParams.get("id") ?? "";
const appName = queryParams.get("providerKey") ?? "";

type ProxiedProvider = _DataWalletProxy & {
  providers: ProxiedProvider[];
  detected: number;
  newProvider: (_DataWalletProxy) => void;
};

class ProxyHandler {
  public providers: ProxiedProvider[] = [];
  public detected = 1;

  get(
    target: _DataWalletProxy,
    prop: keyof _DataWalletProxy | "providers" | "detected",
    receiver,
  ) {
    if (prop === "providers") {
      return this.providers;
    }
    if (prop === "detected") {
      return this.detected;
    }
    return Reflect.get(target, prop, receiver);
  }
  set(target, prop: "newProvider", value: ProxiedProvider, receiver) {
    if (prop === "newProvider") {
      this.providers.push(value);
      this.detected++;
      return true;
    } else {
      return Reflect.set(target, prop, receiver);
    }
  }
}

const inject = () => {
  const sdlDataWallet: ProxiedProvider | undefined = window.sdlDataWallet;
  if (sdlDataWallet) {
    window.sdlDataWallet.newProvider = new Proxy(
      new _DataWalletProxy(appID, appName),
      new ProxyHandler(),
    );
  } else
    window.sdlDataWallet = new Proxy(
      new _DataWalletProxy(appID, appName),
      new ProxyHandler(),
    );
};

inject();
