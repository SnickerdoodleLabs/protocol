import {
  EVMAccountAddress,
  EVMContractAddress,
  TokenUri,
  TokenId,
  CrumbsContractError,
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
      ContractsAbis.ConsentFactoryAbi.abi,
      providerOrSigner,
    );

    /*
    this.contract = new ethers.Contract(
      contractAddress,
      ContractsAbis.CrumbsAbi.abi,
      providerOrSigner,
    );
    */
  }
  

  public addressToCrumbId(
    accountAddress: EVMAccountAddress,
    contractOverrides?: ContractOverrides | undefined,
  ): ResultAsync<TokenId | null, CrumbsContractError> {
    return okAsync(null);
    /*
    return ResultAsync.fromPromise(
      this.contract.addressToCrumbId(
        accountAddress,
        contractOverrides,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new CrumbsContractError("Unable to call addressToCrumbId()", e);
      },
    ).map(() => {});
    */
  }

  public tokenURI(
    tokenId: TokenId,
    contractOverrides?: ContractOverrides | undefined,
  ): ResultAsync<TokenUri | null, CrumbsContractError> {
    return okAsync(null);

    /*
    return ResultAsync.fromPromise(
      this.contract.tokenURI(
        tokenId,
        contractOverrides,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new CrumbsContractError("Unable to call tokenURI()", e);
      },
    ).map(() => {});
    */
  }

  public createCrumb(
    crumbId: TokenId,
    mask: TokenUri,
    contractOverrides?: ContractOverrides | undefined,
  ): ResultAsync<void, CrumbsContractError> {
    return okAsync(undefined);

    /*
    return ResultAsync.fromPromise(
      this.contract.createCrumb(
        crumbId,
        mask,
        contractOverrides,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new CrumbsContractError("Unable to call createCrumb()", e);
      },
    ).map(() => {});
    */
  }

  public burnCrumb(
    crumbId: TokenId,
    contractOverrides?: ContractOverrides | undefined,
  ): ResultAsync<void, CrumbsContractError> {
    return okAsync(undefined);




    /*
    return ResultAsync.fromPromise(
      this.contract.burnCrumb(
        crumbId,
        contractOverrides,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new CrumbsContractError("Unable to call burnCrumb()", e);
      },
    ).map(() => {});
    */
  }
}
