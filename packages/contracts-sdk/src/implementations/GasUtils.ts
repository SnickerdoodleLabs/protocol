import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";
import { ContractOverrides } from "@contracts-sdk/interfaces/objects/index.js";
import { injectable } from "inversify";
import {
  BlockchainErrorMapper,
  BlockchainCommonErrors,
} from "@snickerdoodlelabs/objects";

@injectable()
export class GasUtils {
  static getGasFee(
    providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
  ): ResultAsync<ContractOverrides, BlockchainCommonErrors> {
    return ResultAsync.fromPromise(providerOrSigner.getFeeData(), (e) => {
      return BlockchainErrorMapper.buildBlockchainError(e);
    }).map((feeData) => {
      return new ContractOverrides(feeData.maxFeePerGas);
    });
  }

  static getGasPrice(
    providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
  ): ResultAsync<ContractOverrides, BlockchainCommonErrors> {
    return ResultAsync.fromPromise(providerOrSigner.getFeeData(), (e) => {
      return BlockchainErrorMapper.buildBlockchainError(e);
    }).map((feeData) => {
      return new ContractOverrides(null, feeData.gasPrice);
    });
  }
}
