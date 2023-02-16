import { ChainId, ProviderUrl, URLString } from "@snickerdoodlelabs/objects";
import {
  EPlatform,
  EManifestVersion,
} from "@synamint-extension-sdk/shared/enums/config";
import { IConfigProvider } from "@synamint-extension-sdk/shared/interfaces/configProvider";
import { ExtensionConfig } from "@synamint-extension-sdk/shared/objects/businessObjects/Config";

declare const __ONBOARDING_URL__: string;
declare const __ACCOUNT_COOKIE_URL__: string;
declare const __COOKIE_LIFETIME__: string;
declare const __MANIFEST_VERSION__: EManifestVersion;
declare const __PLATFORM__: EPlatform;
declare const __CONTROL_CHAIN_ID__: string;
declare const __SUPPORTED_CHAINS__: string;
declare const __IPFS_FETCH_BASE_URL__: URLString;
declare const __DEFAULT_INSIGHT_PLATFORM_BASE_URL__: URLString;
declare const __COVALENT_API_KEY__: string;
declare const __MORALIS_API_KEY__: string;
declare const __DNS_SERVER_ADDRESS__: URLString;
declare const __CERAMIC_NODE_URL__: URLString;
declare const __CONTROL_CHAIN_PROVIDER_URL__: ProviderUrl;
declare const __REQUEST_FOR_DATA_EVENT_FREQ__: string;
declare const __DOMAIN_FILTER__: string;

class ConfigProvider implements IConfigProvider {
  protected extensionConfig: ExtensionConfig;
  constructor() {
    // SUPPORTED_CHAINS is a comma-separated list
    // Need to split it into an array
    const supportedChains = (
      __SUPPORTED_CHAINS__ ?? "80001,43113,1,137,43114,-1"
    )
      .split(",")
      .map((chain) => {
        return ChainId(Number.parseInt(chain));
      });

    this.extensionConfig = new ExtensionConfig(
      __ONBOARDING_URL__ ?? "https://datawallet.snickerdoodle.com/",
      __ACCOUNT_COOKIE_URL__ ?? "https://snickerdoodlelabs.io/",
      Number.parseInt(__COOKIE_LIFETIME__ ?? "1"),
      __MANIFEST_VERSION__ ?? EManifestVersion.V3,
      __PLATFORM__ ?? EPlatform.CHROME,
      ChainId(Number.parseInt(__CONTROL_CHAIN_ID__ ?? "43113")),
      supportedChains,
      __IPFS_FETCH_BASE_URL__ ??
        URLString("https://ipfs-gateway.snickerdoodle.com/ipfs/"),
      __DEFAULT_INSIGHT_PLATFORM_BASE_URL__ ??
        URLString("https://insight-api.snickerdoodle.com/v0/"),
      __CERAMIC_NODE_URL__ ?? URLString(""),
      __CONTROL_CHAIN_PROVIDER_URL__ ?? undefined,
      __COVALENT_API_KEY__ ?? undefined,
      __MORALIS_API_KEY__ ?? undefined,
      __DNS_SERVER_ADDRESS__ ? __DNS_SERVER_ADDRESS__ : undefined,
      Number.parseInt(__REQUEST_FOR_DATA_EVENT_FREQ__ ?? "4000"),
      __DOMAIN_FILTER__ ?? "(localhost|chrome://)",
    );
  }
  public getConfig() {
    return this.extensionConfig;
  }
}
export const configProvider = new ConfigProvider();
