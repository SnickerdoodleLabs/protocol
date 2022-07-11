import Browser from "webextension-polyfill";
import LocalMessageStream from "post-message-stream";
import pump from "pump";
import ObjectMultiplex from "obj-multiplex";
import {
  CONTENT_SCRIPT_POSTMESSAGE_CHANNEL_IDENTIFIER,
  ONBOARDING_PROVIDER_POSTMESSAGE_CHANNEL_IDENTIFIER,
  ONBOARDING_PROVIDER_SUBSTREAM,
} from "@shared/constants/ports";
export class OnboardingProviderInjector {
  private extensionMux: any;
  constructor(extensionMux) {
    this.extensionMux = extensionMux;
  }

  public startPipeline() {
    this._setupStreams();
    this._inject();
  }
  private _setupStreams() {
    const postMessageStream = new LocalMessageStream({
      name: CONTENT_SCRIPT_POSTMESSAGE_CHANNEL_IDENTIFIER,
      target: ONBOARDING_PROVIDER_POSTMESSAGE_CHANNEL_IDENTIFIER,
    });
    const pageMux = new ObjectMultiplex();
    pump(pageMux, postMessageStream, pageMux);
    const pageStreamChannel = pageMux.createStream(
      ONBOARDING_PROVIDER_SUBSTREAM,
    );
    const extensionStreamChannel = this.extensionMux.createStream(
      ONBOARDING_PROVIDER_SUBSTREAM,
    );
    pump(pageStreamChannel, extensionStreamChannel, pageStreamChannel);
  }
  private _inject() {
    try {
      const node = document.head || document.documentElement;
      const script = document.createElement("script");
      script.setAttribute(
        "src",
        Browser.runtime.getURL("injectables/onboarding.bundle.js"),
      );
      node.appendChild(script);
      this._notify();
    } catch (e) {
      console.error("sdlDataWallet onboarding provider injection failed", e);
    }
  }
  private _notify() {
    document.dispatchEvent(new CustomEvent("SD_WALLET_EXTENSION_CONNECTED"));
  }
}
