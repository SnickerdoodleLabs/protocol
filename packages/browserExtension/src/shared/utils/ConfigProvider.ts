import { ChainId, ProviderUrl, URLString } from "@snickerdoodlelabs/objects";

import { EPlatform, EManifestVersion } from "@shared/enums/config";
import { IConfigProvider } from "@shared/interfaces/configProvider";
import { ExtensionConfig } from "@shared/objects/Config";

declare const __ONBOARDING_URL__: string;
declare const __ACCOUNT_COOKIE_URL__: string;
declare const __COOKIE_LIFETIME__: string; // year
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

class ConfigProvider implements IConfigProvider {
  protected extensionConfig: ExtensionConfig;
  constructor() {
    // SUPPORTED_CHAINS is a comma-separated list
    // Need to split it into an array
    const supportedChains = __SUPPORTED_CHAINS__.split(",").map((chain) => {
      return ChainId(Number.parseInt(chain));
    });

    this.extensionConfig = new ExtensionConfig(
      __ONBOARDING_URL__,
      __ACCOUNT_COOKIE_URL__,
      Number.parseInt(__COOKIE_LIFETIME__),
      __MANIFEST_VERSION__,
      __PLATFORM__,
      ChainId(Number.parseInt(__CONTROL_CHAIN_ID__)),
      supportedChains,
      __IPFS_FETCH_BASE_URL__,
      __DEFAULT_INSIGHT_PLATFORM_BASE_URL__,
      __CERAMIC_NODE_URL__,
      __CONTROL_CHAIN_PROVIDER_URL__ === ""
        ? undefined
        : __CONTROL_CHAIN_PROVIDER_URL__,
      __COVALENT_API_KEY__ === "" ? undefined : __COVALENT_API_KEY__,
      __MORALIS_API_KEY__ === "" ? undefined : __MORALIS_API_KEY__,
      __DNS_SERVER_ADDRESS__ === "" ? undefined : __DNS_SERVER_ADDRESS__,
      Number.parseInt(__REQUEST_FOR_DATA_EVENT_FREQ__),
    );
  }
  public getConfig() {
    return this.extensionConfig;
  }
}
const configProvider = new ConfigProvider();
export default configProvider;
