import Config from "@shared/constants/Config";
import { EManifestVersion } from "@shared/enums/config";
export class VersionUtils {
  public static get isManifest3() {
    return Config.manifestVersion === EManifestVersion.V3;
  }
}
