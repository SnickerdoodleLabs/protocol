import { VersionUtils } from "@shared/utils/VersionUtils";
import OnboardingProvider from "@app/Content/OnboardingProvider";

const isManifest3 = VersionUtils.isManifest3;
Object.defineProperty(window, "sdlDataWallet", {
  enumerable: false,
  writable: isManifest3,
  configurable: isManifest3,
  value: OnboardingProvider,
});
