import ConfigProvider from "@shared/utils/ConfigProvider";
import { EManifestVersion } from "@shared/enums/config";
export class VersionUtils {
  public static get isManifest3() {
    return ConfigProvider.getConfig().manifestVersion === EManifestVersion.V3;
  }
}
