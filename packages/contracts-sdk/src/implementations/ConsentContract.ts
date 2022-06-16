import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";
import {
  ConsentContractError,
  EthereumAccountAddress,
  EthereumContractAddress,
  IpfsCID,
  OptInTokenId,
  OptInTokenUri,
  Signature,
} from "@snickerdoodlelabs/objects";

import { ContractOverrides } from "@contracts-sdk/interfaces/objects/ContractOverrides";
import { IConsentContract } from "@contracts-sdk/interfaces/IConsentContract";

import { ContractsAbis } from "@contracts-sdk/interfaces/objects/abi";

export class ConsentContract implements IConsentContract {
  protected contract: ethers.Contract;
  constructor(
    protected providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
    consentAddress: EthereumContractAddress,
  ) {
    this.contract = new ethers.Contract(
      consentAddress,
      ContractsAbis.ConsentAbi.abi,
      providerOrSigner,
    );
  }

  public optIn(
    tokenId: OptInTokenId,
    agreementURI: OptInTokenUri,
    contractOverrides?: ContractOverrides,
  ): ResultAsync<void, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.optIn(
        tokenId,
        agreementURI,
        contractOverrides,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ConsentContractError("Unable to call optIn()", e);
      },
    ).map(() => {});
  }

  public restrictedOptIn(
    tokenId: OptInTokenId,
    agreementURI: OptInTokenUri,
    nonce: number,
    signature: Signature,
    contractOverrides?: ContractOverrides,
  ): ResultAsync<void, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.restrictedOptIn(
        tokenId,
        agreementURI,
        nonce,
        signature,
        contractOverrides,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ConsentContractError("Unable to call restrictedOptIn()", e);
      },
    ).map(() => {});
  }

  public requestForData(
    ipfsCID: IpfsCID,
  ): ResultAsync<void, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.requestForData(
        ipfsCID,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ConsentContractError("Unable to call requestForData()", e);
      },
    ).map(() => {});
  }

  public getConsentOwner(): ResultAsync<
    EthereumAccountAddress,
    ConsentContractError
  > {
    return ResultAsync.fromPromise(
      this.contract.owner() as Promise<EthereumAccountAddress>,
      (e) => {
        return new ConsentContractError("Unable to call getConsentOwner()", e);
      },
    );
  }
}
