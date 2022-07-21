import { EPlatform, EManifestVersion } from "@shared/enums/config";
import { IConfigProvider } from "@shared/interfaces/configProvider";
import { ExtensionConfig } from "@shared/objects/Config";

declare const __ONBOARDING_URL__: string;
declare const __MANIFEST_VERSION__: EManifestVersion;
declare const __PLATFORM__: EPlatform;

class ConfigProvider implements IConfigProvider {
  protected extensionConfig: ExtensionConfig;
  constructor() {
    this.extensionConfig = new ExtensionConfig(
      __ONBOARDING_URL__,
      __MANIFEST_VERSION__,
      __PLATFORM__,
    );
  }
  public getConfig() {
    return this.extensionConfig;
  }
}
const configProvider = new ConfigProvider();
export default configProvider;
