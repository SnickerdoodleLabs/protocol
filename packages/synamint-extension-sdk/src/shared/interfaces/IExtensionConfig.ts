import { EVMContractAddress, URLString } from "@snickerdoodlelabs/objects";

export interface IExtensionConfig {
  providerKey: string;
  onboardingURL: URLString;
  defaulConsentContract?: EVMContractAddress;
}
