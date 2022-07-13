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

import { IConsentContract } from "@contracts-sdk/interfaces/IConsentContract";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/abi";
import { ContractOverrides } from "@contracts-sdk/interfaces/objects/ContractOverrides";

@injectable()
export class ConsentContract implements IConsentContract {
  protected contract: ethers.Contract;
  constructor(
    protected providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
    consentAddress: EVMContractAddress,
  ) {
    this.contract = new ethers.Contract(
      consentAddress,
      ContractsAbis.ConsentAbi.abi,
      providerOrSigner,
    );
  }

  public getContractAddress(): EVMContractAddress {
    return EVMContractAddress(this.contract?.address || "");
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
    EVMAccountAddress,
    ConsentContractError
  > {
    return ResultAsync.fromPromise(
      this.contract.owner() as Promise<EVMAccountAddress>,
      (e) => {
        return new ConsentContractError("Unable to call getConsentOwner()", e);
      },
    );
  }

  public balanceOf(
    address: EVMAccountAddress,
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
    fromBlock?: BlockNumber,
    toBlock?: BlockNumber,
  ): ResultAsync<Event[], ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract?.queryFilter(eventFilter, fromBlock, toBlock) as Promise<
        Event[]
      >,
      (e) => {
        return new ConsentContractError("Unable to call queryFilter()", e);
      },
    );
  }

  public getConsentTokensOfAddress(
    ownerAddress: EVMAccountAddress,
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

  public addDomain(domain: string): ResultAsync<void, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.addDomain(
        domain,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ConsentContractError("Unable to call requestForData()", e);
      },
    ).map(() => {});
  }

  public removeDomain(domain: string): ResultAsync<void, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.removeDomain(
        domain,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ConsentContractError("Unable to call requestForData()", e);
      },
    ).map(() => {});
  }

  public getDomains(): ResultAsync<string[], ConsentContractError> {
    return ResultAsync.fromPromise(
      // returns array of domains
      this.contract.getDomains() as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ConsentContractError("Unable to call requestForData()", e);
      },
    );
  }

  public getRequestForDataListByRequesterAddress(
    requesterAddress: EVMAccountAddress,
    fromBlock?: BlockNumber,
    toBlock?: BlockNumber,
  ): ResultAsync<RequestForData[], ConsentContractError> {
    return this.filters
      .RequestForData(requesterAddress)
      .andThen((eventFilter) => {
        return this.queryFilter(eventFilter, fromBlock, toBlock);
      })
      .andThen((logsEvents) => {
        return ResultUtils.combine(
          logsEvents.map((logEvent) => {
            return okAsync(
              new RequestForData(
                this.getContractAddress(),
                logEvent.args?.requester,
                logEvent.args?.ipfsCID,
                BlockNumber(logEvent.blockNumber),
              ),
            );
          }),
        );
      });
  }

  public filters = {
    Transfer: (
      fromAddress: EVMAccountAddress | null,
      toAddress: EVMAccountAddress | null,
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
    RequestForData: (
      ownerAddress: EVMAccountAddress,
    ): ResultAsync<EventFilter, ConsentContractError> => {
      return ResultAsync.fromPromise(
        this.contract?.filters.RequestForData(
          ownerAddress,
        ) as Promise<EventFilter>,
        (e) => {
          return new ConsentContractError(
            "Unable to call filters.RequestForData()",
            e,
          );
        },
      );
    },
  };
}
