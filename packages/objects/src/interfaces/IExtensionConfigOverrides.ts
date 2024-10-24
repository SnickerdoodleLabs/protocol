import { EVMContractAddress, URLString } from "@objects/primitives/index.js";

export interface IExtensionConfigOverrides {
  onboardingURL?: URLString;
  providerKey: string;
  defaulConsentContract?: EVMContractAddress;
}
