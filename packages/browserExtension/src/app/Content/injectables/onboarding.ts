import OnboardingProvider from "@app/Content/OnboardingProvider";
import { VersionUtils } from "@shared/utils/VersionUtils";

// since manifest 3 does not provide persist bg page we have to redefine that property periodically
const isManifest3 = VersionUtils.isManifest3;
Object.defineProperty(window, "sdlDataWallet", {
  enumerable: false,
  writable: isManifest3,
  configurable: isManifest3,
  value: OnboardingProvider,
});
