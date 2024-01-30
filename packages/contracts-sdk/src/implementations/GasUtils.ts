import { BlockchainCommonErrors, EChain } from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { Wallet } from "zksync-web3";

import { BlockchainErrorMapper } from "@contracts-sdk/implementations/BlockchainErrorMapper.js";
import { ContractOverrides } from "@contracts-sdk/interfaces/objects/index.js";

@injectable()
export class GasUtils {
  static getGasFee(
    providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet
      | Wallet,
  ): ResultAsync<ContractOverrides, BlockchainCommonErrors> {
    return ResultAsync.fromPromise(providerOrSigner.getFeeData(), (e) => {
      return BlockchainErrorMapper.buildErrorFromProviderError(
        EChain.DevDoodle, // TODO: There should be a better way to get the chainID
        e as Error,
      );
    }).map((feeData) => {
      return new ContractOverrides(feeData.maxFeePerGas);
    });
  }

  static getGasPrice(
    providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet
      | Wallet,
  ): ResultAsync<ContractOverrides, BlockchainCommonErrors> {
    return ResultAsync.fromPromise(providerOrSigner.getFeeData(), (e) => {
      return BlockchainErrorMapper.buildErrorFromProviderError(
        EChain.DevDoodle, // TODO: There should be a better way to get the chainID
        e as Error,
      );
    }).map((feeData) => {
      return new ContractOverrides(null, feeData.gasPrice);
    });
  }
}
