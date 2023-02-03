import {
  EPlatform,
  EManifestVersion,
} from "@synamint-extension-sdk/shared/enums/config";
import { IConfigProvider } from "@synamint-extension-sdk/shared/interfaces/configProvider";
import { ExtensionConfig } from "@synamint-extension-sdk/shared/objects/Config";
import { ChainId, ProviderUrl, URLString } from "@snickerdoodlelabs/objects";

class ConfigProvider implements IConfigProvider {
  protected extensionConfig: ExtensionConfig;
  constructor() {
    // SUPPORTED_CHAINS is a comma-separated list
    // Need to split it into an array
    const supportedChains = "80001,43113,1,137,43114,-1"
      .split(",")
      .map((chain) => {
        return ChainId(Number.parseInt(chain));
      });

    this.extensionConfig = new ExtensionConfig(
      "https://datawallet.snickerdoodle.com/",
      "https://snickerdoodlelabs.io/",
      Number.parseInt("1"),
      EManifestVersion.V3,
      EPlatform.CHROME,
      ChainId(Number.parseInt("43113")),
      supportedChains,
      URLString("https://ipfs-gateway.snickerdoodle.com/ipfs/"),
      URLString("https://insight-api.snickerdoodle.com/v0/"),
      URLString(""),
      undefined,
      undefined,
      undefined,
      undefined,
      Number.parseInt("4000"),
    );
  }
  public getConfig() {
    return this.extensionConfig;
  }
}
const configProvider = new ConfigProvider();
export default configProvider;
