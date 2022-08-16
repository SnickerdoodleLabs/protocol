import { EManifestVersion } from "@shared/enums/config";
import ConfigProvider from "@shared/utils/ConfigProvider";
export class VersionUtils {
  public static get isManifest3() {
    return ConfigProvider.getConfig().manifestVersion === EManifestVersion.V3;
  }
}
