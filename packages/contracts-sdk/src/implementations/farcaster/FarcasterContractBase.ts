import {
  EVMContractAddress,
  BlockchainCommonErrors,
  FarcasterBundlerContractError,
  EChain,
  ChainId,
  getChainInfoByChain,
} from "@snickerdoodlelabs/objects";
import { Network, ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";
import { UnexpectedNetworkError } from "packages/objects/src/errors/blockchain/UnexpectedNetworkError";

import { BaseContract } from "@contracts-sdk/implementations/BaseContract.js";
@injectable()
export abstract class FarcasterContractBase<
  TContractSpecificError,
> extends BaseContract<TContractSpecificError> {
  constructor(
    protected providerOrSigner: ethers.Provider | ethers.Signer,
    protected contractAddress: EVMContractAddress,
    protected abi: ethers.InterfaceAbi,
  ) {
    super(providerOrSigner, contractAddress, abi);
  }

  public ensureOptimism(): ResultAsync<
    void,
    TContractSpecificError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.providerOrSigner.provider?.getNetwork() as Promise<Network>,
      (e) => {
        return this.generateError(e, "Unable to call price()");
      },
    ).andThen((network) => {
      if (
        ChainId(Number(network.chainId)) !=
        getChainInfoByChain(EChain.Optimism).chainId
      ) {
        return errAsync(
          new UnexpectedNetworkError(
            "Provider or signer is not for Optimism Chain",
            "FarcasterContractBase: ensureOptimism()",
          ),
        );
      }
      return okAsync(undefined);
    });
  }
}
