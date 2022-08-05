import { Config } from "@extension-onboarding/services/blockChainWalletProviders/interfaces/objects";
import { EVMAccountAddress, Signature } from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

export interface IWalletProvider {
  isInstalled: boolean;
  config: Config;
  connect(): ResultAsync<EVMAccountAddress, unknown>;
  getSignature(message: string): ResultAsync<Signature, unknown>;
  getWeb3Provider(): ResultAsync<
    ethers.providers.Web3Provider | undefined,
    never
  >;
  getWeb3Signer(): ResultAsync<
    ethers.providers.JsonRpcSigner | undefined,
    never
  >;
  checkAndSwitchToControlChain(): ResultAsync<ethers.providers.Web3Provider, unknown>;
}
