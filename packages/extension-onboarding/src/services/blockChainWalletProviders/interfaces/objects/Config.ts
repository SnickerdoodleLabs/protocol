import { ChainInformation } from "@extension-onboarding/services/blockChainWalletProviders/interfaces/objects/ChainInformation";

export class Config {
  constructor(public infuraId: string, public controlChain: ChainInformation) {}
}
