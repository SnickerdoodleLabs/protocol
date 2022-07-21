import { EManifestVersion, EPlatform } from "@shared/enums/config";

export class ExtensionConfig {
    constructor(
      public onboardingUrl: string,
      public manifestVersion: EManifestVersion,
      public platform: EPlatform,
    ) {}
  }