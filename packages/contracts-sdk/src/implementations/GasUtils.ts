import {
  BlockchainCommonErrors,
  BlockchainProviderError,
  EChain,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

import { BlockchainErrorMapper } from "@contracts-sdk/implementations/BlockchainErrorMapper.js";
import { ContractOverrides } from "@contracts-sdk/interfaces/objects/index.js";

@injectable()
export class GasUtils {
  static getGasFee(
    providerOrSigner: ethers.Provider | ethers.JsonRpcSigner | ethers.Wallet,
  ): ResultAsync<ContractOverrides, BlockchainCommonErrors> {
    return GasUtils.getProvider(providerOrSigner)
      .andThen((provider) => {
        return ResultAsync.fromPromise(provider.getFeeData(), (e) => {
          return BlockchainErrorMapper.buildErrorFromProviderError(
            EChain.DevDoodle, // TODO: There should be a better way to get the chainID
            e as Error,
          );
        });
      })
      .map((feeData) => {
        return new ContractOverrides(feeData.maxFeePerGas);
      });
  }

  static getGasPrice(
    providerOrSigner: ethers.Provider | ethers.JsonRpcSigner | ethers.Wallet,
  ): ResultAsync<ContractOverrides, BlockchainCommonErrors> {
    return GasUtils.getProvider(providerOrSigner)
      .andThen((provider) => {
        return ResultAsync.fromPromise(provider.getFeeData(), (e) => {
          return BlockchainErrorMapper.buildErrorFromProviderError(
            EChain.DevDoodle, // TODO: There should be a better way to get the chainID
            e as Error,
          );
        });
      })
      .map((feeData) => {
        return new ContractOverrides(null, feeData.gasPrice);
      });
  }

  private static getProvider(
    providerOrSigner: ethers.Provider | ethers.JsonRpcSigner | ethers.Wallet,
  ): ResultAsync<ethers.Provider, BlockchainProviderError> {
    const provider = providerOrSigner.provider;
    if (provider == null) {
      return errAsync(
        new BlockchainProviderError(
          EChain.EthereumMainnet,
          "No provider available on providerOrSigner in getGasPrice",
        ),
      );
    }
    return okAsync(provider);
  }
}
