import { ethers, EventFilter, Event } from "ethers";
import { okAsync, ResultAsync } from "neverthrow";
import {
  ConsentContractError,
  EthereumAccountAddress,
  EthereumContractAddress,
  IpfsCID,
  TokenUri,
  Signature,
  TokenIdNumber,
  ConsentToken,
} from "@snickerdoodlelabs/objects";

import { ContractOverrides } from "@contracts-sdk/interfaces/objects/ContractOverrides";
import { IConsentContract } from "@contracts-sdk/interfaces/IConsentContract";

import { ContractsAbis } from "@contracts-sdk/interfaces/objects/abi";
import { BigNumber } from "ethers";
import { ResultUtils } from "neverthrow-result-utils";

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
    tokenId: TokenIdNumber,
    agreementURI: TokenUri,
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
    tokenId: TokenIdNumber,
    agreementURI: TokenUri,
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

  public balanceOf(
    address: EthereumAccountAddress,
  ): ResultAsync<number, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract?.balanceOf(address) as Promise<BigNumber>,
      (e) => {
        return new ConsentContractError("Unable to call balanceOf()", e);
      },
    ).map((numberOfTokens) => numberOfTokens.toNumber());
  }

  public tokenURI(
    tokenId: TokenIdNumber,
  ): ResultAsync<TokenUri, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract?.tokenURI(tokenId) as Promise<TokenUri>,
      (e) => {
        return new ConsentContractError("Unable to call tokenURI()", e);
      },
    );
  }

  public queryFilter(
    eventFilter: EventFilter,
  ): ResultAsync<Event[], ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract?.queryFilter(eventFilter) as Promise<Event[]>,
      (e) => {
        return new ConsentContractError("Unable to call queryFilter()", e);
      },
    );
  }

  public getConsentTokensOfAddress(
    ownerAddress: EthereumAccountAddress,
  ): ResultAsync<ConsentToken[], ConsentContractError> {
    return this.balanceOf(ownerAddress).andThen((numberOfTokens) => {
      if (numberOfTokens === 0) {
        return okAsync([]);
      }

      return this.filters
        .Transfer(null, ownerAddress)
        .andThen((eventFilter) => {
          return this.queryFilter(eventFilter);
        })
        .andThen((logsEvents) => {
          return ResultUtils.combine(
            logsEvents.map((logEvent) => {
              return this.tokenURI(logEvent.args?.tokenId).andThen(
                (tokenUri) => {
                  return okAsync(
                    new ConsentToken(
                      ownerAddress,
                      TokenIdNumber(logEvent.args?.tokenId?.toNumber()),
                      tokenUri,
                    ),
                  );
                },
              );
            }),
          );
        });
    });
  }

  public filters = {
    Transfer: (
      fromAddress: EthereumAccountAddress | null,
      toAddress: EthereumAccountAddress | null,
    ): ResultAsync<EventFilter, ConsentContractError> => {
      return ResultAsync.fromPromise(
        this.contract?.filters.Transfer(
          fromAddress,
          toAddress,
        ) as Promise<EventFilter>,
        (e) => {
          return new ConsentContractError(
            "Unable to call filters.Transfer()",
            e,
          );
        },
      );
    },
  };
}
