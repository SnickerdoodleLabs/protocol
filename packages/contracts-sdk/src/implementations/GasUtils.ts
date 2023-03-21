import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";
import { ContractOverrides } from "@contracts-sdk/interfaces/objects/index.js";
import { injectable } from "inversify";
import { GasPriceError } from "@snickerdoodlelabs/objects";

@injectable()
export class GasUtils {
  static getGasFee<E = GasPriceError>(
    providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
  ): ResultAsync<ContractOverrides, E> {
    return ResultAsync.fromPromise(providerOrSigner.getFeeData(), (e) => {
      return e as E;
    }).map((feeData) => {
      return new ContractOverrides(feeData.maxFeePerGas);
    });
  }

  static getGasPrice<E = GasPriceError>(
    providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
  ): ResultAsync<ContractOverrides, E> {
    return ResultAsync.fromPromise(providerOrSigner.getFeeData(), (e) => {
      return e as E;
    }).map((feeData) => {
      return new ContractOverrides(null, feeData.gasPrice);
    });
  }
}
