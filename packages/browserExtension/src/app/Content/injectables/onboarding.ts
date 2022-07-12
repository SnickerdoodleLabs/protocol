import OnboardingProvider from "../OnboardingProvider";

// since manifest 3 does not provide persist bg page we have to redefine that property periodically
Object.defineProperty(window, "sdlDataWallet", {
  enumerable: false,
  writable: true,
  configurable: true,
  value: OnboardingProvider,
});
