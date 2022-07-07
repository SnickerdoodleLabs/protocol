import {
  ConsentContractError,
  EVMAccountAddress,
  EVMContractAddress,
  IpfsCID,
  TokenUri,
  Signature,
  TokenIdNumber,
  ConsentToken,
  RequestForData,
  BlockNumber,
} from "@snickerdoodlelabs/objects";
import { ethers, EventFilter, Event, BigNumber } from "ethers";
import { injectable } from "inversify";
import { ok, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { ICrumbsContract } from "@contracts-sdk/interfaces/ICrumbsContract";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/abi";
import { ContractOverrides } from "@contracts-sdk/interfaces/objects/ContractOverrides";

@injectable()
export class CrumbsContract implements ICrumbsContract {
  protected contract: ethers.Contract;
  constructor(
    protected providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
    contractAddress: EVMContractAddress,
  ) {
    this.contract = new ethers.Contract(
      contractAddress,
      ContractsAbis.CrumbsAbi.abi,
      providerOrSigner,
    );
  }

  public getCrumb(
    accountAddress: EVMAccountAddress,
    contractOverrides?: ContractOverrides | undefined,
  ): ResultAsync<TokenUri | null, ConsentContractError> {
    return okAsync(null);
  }
}
