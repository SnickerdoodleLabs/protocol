import {
  BlockchainCommonErrors,
  BlockchainErrorMapper,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { Wallet } from "zksync-web3";

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
      return BlockchainErrorMapper.buildBlockchainError(e);
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
      return BlockchainErrorMapper.buildBlockchainError(e);
    }).map((feeData) => {
      return new ContractOverrides(null, feeData.gasPrice);
    });
  }
}
