import { IConsentContract } from "@contracts-sdk/interfaces/IConsentContract";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/abi";
import { ConsentRoles } from "@contracts-sdk/interfaces/objects/ConsentRoles";
import { ContractOverrides } from "@contracts-sdk/interfaces/objects/ContractOverrides";
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
  IBlockchainError,
} from "@snickerdoodlelabs/objects";
import { ethers, EventFilter, Event, BigNumber } from "ethers";
import { injectable } from "inversify";
import { ok, err, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

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
        return new ConsentContractError(
          "Unable to call optIn()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new ConsentContractError(
            "Wait for optIn() failed",
            "Unknown",
            e,
          );
        });
      })
      .map(() => {});
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
        return new ConsentContractError(
          "Unable to call optIn()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new ConsentContractError(
            "Wait for optIn() failed",
            "Unknown",
            e,
          );
        });
      })
      .map(() => {});
  }

  public requestForData(
    ipfsCID: IpfsCID,
  ): ResultAsync<void, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.requestForData(
        ipfsCID,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ConsentContractError(
          "Unable to call requestForData()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new ConsentContractError(
            "Wait for addDomain() failed",
            "Unknown",
            e,
          );
        });
      })
      .map(() => {});
  }

  // Returns the address Consent contract contract's owner
  // Note that the address on index 0 of the DEFAULT_ADMIN_ROLE members is the contract owner
  public getConsentOwner(): ResultAsync<
    EVMAccountAddress,
    ConsentContractError
  > {
    return ResultAsync.fromPromise(
      this.contract.getRoleMember(
        ConsentRoles.DEFAULT_ADMIN_ROLE,
        0,
      ) as Promise<EVMAccountAddress>,
      (e) => {
        return new ConsentContractError(
          "Unable to call getRoleMember()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    );
  }

  // Returns an array of address that has the DEFAULT_ADMIN_ROLE on the Consent contract
  // Note that the address on index 0 is the contract owner
  public getDefaultAdminRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ConsentContractError
  > {
    return ResultAsync.fromPromise(
      this.contract.getRoleMemberCount(
        ConsentRoles.DEFAULT_ADMIN_ROLE,
      ) as Promise<BigNumber>,
      (e) => {
        return new ConsentContractError(
          "Unable to call getDefaultAdminRoleMembers()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).andThen((memberCount) => {
      // First get an array of index values so that it can be used with ResultUtils.combine
      const memberIndexArray: number[] = [];

      for (let i = 0; i < memberCount.toNumber(); i++) {
        memberIndexArray.push(i);
      }

      // Map through each index value and get its role member address
      return ResultUtils.combine(
        memberIndexArray.map((index) => {
          return ResultAsync.fromPromise(
            this.contract.getRoleMember(
              ConsentRoles.DEFAULT_ADMIN_ROLE,
              index,
            ) as Promise<EVMAccountAddress>,
            (e) => {
              return new ConsentContractError(
                "Unable to call getRoleMember()",
                (e as IBlockchainError).reason,
                e,
              );
            },
          );
        }),
      );
    });
  }

  public getSignerRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ConsentContractError
  > {
    return ResultAsync.fromPromise(
      this.contract.getRoleMemberCount(
        ConsentRoles.SIGNER_ROLE,
      ) as Promise<BigNumber>,
      (e) => {
        return new ConsentContractError(
          "Unable to call getSignerRoleMembers()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).andThen((memberCount) => {
      // First get an array of index values so that it can be used with ResultUtils.combine
      const memberIndexArray: number[] = [];

      for (let i = 0; i < memberCount.toNumber(); i++) {
        memberIndexArray.push(i);
      }

      // Map through each index value and get its role member address
      return ResultUtils.combine(
        memberIndexArray.map((index) => {
          return ResultAsync.fromPromise(
            this.contract.getRoleMember(
              ConsentRoles.PAUSER_ROLE,
              index,
            ) as Promise<EVMAccountAddress>,
            (e) => {
              return new ConsentContractError(
                "Unable to call getRoleMember() for SIGNER_ROLE",
                (e as IBlockchainError).reason,
                e,
              );
            },
          );
        }),
      );
    });
  }

  public getPauserRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ConsentContractError
  > {
    return ResultAsync.fromPromise(
      this.contract.getRoleMemberCount(
        ConsentRoles.PAUSER_ROLE,
      ) as Promise<BigNumber>,
      (e) => {
        return new ConsentContractError(
          "Unable to call getPauserRoleMembers()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).andThen((memberCount) => {
      // First get an array of index values so that it can be used with ResultUtils.combine
      const memberIndexArray: number[] = [];

      for (let i = 0; i < memberCount.toNumber(); i++) {
        memberIndexArray.push(i);
      }

      // Map through each index value and get its role member address
      return ResultUtils.combine(
        memberIndexArray.map((index) => {
          return ResultAsync.fromPromise(
            this.contract.getRoleMember(
              ConsentRoles.PAUSER_ROLE,
              index,
            ) as Promise<EVMAccountAddress>,
            (e) => {
              return new ConsentContractError(
                "Unable to call getRoleMember() for PAUSER_ROLE",
                (e as IBlockchainError).reason,
                e,
              );
            },
          );
        }),
      );
    });
  }

  public getRequesterRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ConsentContractError
  > {
    return ResultAsync.fromPromise(
      this.contract.getRoleMemberCount(
        ConsentRoles.REQUESTER_ROLE,
      ) as Promise<BigNumber>,
      (e) => {
        return new ConsentContractError(
          "Unable to call getRequesterRoleMembers()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).andThen((memberCount) => {
      // First get an array of index values so that it can be used with ResultUtils.combine
      const memberIndexArray: number[] = [];

      for (let i = 0; i < memberCount.toNumber(); i++) {
        memberIndexArray.push(i);
      }

      // Map through each index value and get its role member address
      return ResultUtils.combine(
        memberIndexArray.map((index) => {
          return ResultAsync.fromPromise(
            this.contract.getRoleMember(
              ConsentRoles.REQUESTER_ROLE,
              index,
            ) as Promise<EVMAccountAddress>,
            (e) => {
              return new ConsentContractError(
                "Unable to call getRoleMember() for REQUESTER_ROLE",
                (e as IBlockchainError).reason,
                e,
              );
            },
          );
        }),
      );
    });
  }

  public balanceOf(
    address: EVMAccountAddress,
  ): ResultAsync<number, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.balanceOf(address) as Promise<BigNumber>,
      (e) => {
        return new ConsentContractError(
          "Unable to call balanceOf()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map((numberOfTokens) => numberOfTokens.toNumber());
  }

  public tokenURI(
    tokenId: TokenIdNumber,
  ): ResultAsync<TokenUri | null, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract?.tokenURI(tokenId) as Promise<TokenUri | null>,
      (e) => {
        return new ConsentContractError(
          "Unable to call tokenURI()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).orElse((error) => {
      // The contract reverts with this message if tokenId does not exist
      if (error.reason === "ERC721: operator query for nonexistent token") {
        return ok(null);
      }
      return err(error);
    });
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
        return new ConsentContractError(
          "Unable to call queryFilter()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    );
  }

  public getConsentTokensOfAddress(
    ownerAddress: EVMAccountAddress,
  ): ResultAsync<ConsentToken[], ConsentContractError> {
    return this.balanceOf(ownerAddress).andThen((numberOfTokens) => {
      if (numberOfTokens === 0) {
        return okAsync([] as ConsentToken[]);
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
                      tokenUri as TokenUri,
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
        return new ConsentContractError(
          "Unable to call addDomain()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new ConsentContractError(
            "Wait for addDomain() failed",
            "Unknown",
            e,
          );
        });
      })
      .map(() => {});
  }

  public removeDomain(domain: string): ResultAsync<void, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.removeDomain(
        domain,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ConsentContractError(
          "Unable to call removeDomain()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new ConsentContractError(
            "Wait for removeDomain() failed",
            "Unknown",
            e,
          );
        });
      })
      .map(() => {});
  }

  public getDomains(): ResultAsync<string[], ConsentContractError> {
    return ResultAsync.fromPromise(
      // returns array of domains
      this.contract.getDomains() as Promise<string[]>,
      (e) => {
        return new ConsentContractError(
          "Unable to call getDomains()",
          (e as IBlockchainError).reason,
          e,
        );
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
            (e as IBlockchainError).reason,
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
            (e as IBlockchainError).reason,
            e,
          );
        },
      );
    },
  };
}
