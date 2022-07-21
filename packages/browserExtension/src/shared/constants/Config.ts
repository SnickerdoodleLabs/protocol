import { EPlatform, EManifestVersion } from "@shared/enums/config";

declare const __ONBOARDING_URL__: string;
declare const __MANIFEST_VERSION__: EManifestVersion;
declare const __PLATFORM__: EPlatform;

export class Config {
  static get onboardingUrl(): string {
    return __ONBOARDING_URL__;
  }

  static get manifestVersion(): EManifestVersion {
    return __MANIFEST_VERSION__;
  }

  static get platform(): EPlatform {
    return __PLATFORM__;
  }
}

export default Config;
