import { ICryptoUtils } from "@snickerdoodlelabs/common-utils";
import {
  ConsentContractError,
  EVMAccountAddress,
  EVMContractAddress,
  IpfsCID,
  TokenUri,
  Signature,
  TokenId,
  ConsentToken,
  RequestForData,
  BlockNumber,
  IBlockchainError,
  DomainName,
  BaseURI,
  HexString,
  DataPermissions,
  HexString32,
  InvalidParametersError,
} from "@snickerdoodlelabs/objects";
import { ethers, EventFilter, Event, BigNumber } from "ethers";
import { injectable } from "inversify";
import { ok, err, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IConsentContract } from "@contracts-sdk/interfaces/IConsentContract";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/abi";
import { ConsentRoles } from "@contracts-sdk/interfaces/objects/ConsentRoles";

@injectable()
export class ConsentContract implements IConsentContract {
  protected contract: ethers.Contract;
  constructor(
    protected providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
    protected contractAddress: EVMContractAddress,
    protected cryptoUtils: ICryptoUtils,
  ) {
    this.contract = new ethers.Contract(
      contractAddress,
      ContractsAbis.ConsentAbi.abi,
      providerOrSigner,
    );
  }

  public getContractAddress(): EVMContractAddress {
    return this.contractAddress;
  }

  public optIn(
    tokenId: TokenId,
    agreementFlags: HexString32,
  ): ResultAsync<void, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.optIn(
        tokenId,
        agreementFlags,
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

  // TODO: add data permissions param
  public encodeOptIn(tokenId: TokenId, agreementFlags: HexString32): HexString {
    return HexString(
      this.contract.interface.encodeFunctionData("optIn", [
        tokenId,
        agreementFlags,
      ]),
    );
  }

  public encodeRestrictedOptIn(
    tokenId: TokenId,
    signature: Signature,
    agreementFlags: HexString32,
  ): HexString {
    return HexString(
      this.contract.interface.encodeFunctionData("restrictedOptIn", [
        tokenId,
        agreementFlags,
        signature,
      ]),
    );
  }

  public restrictedOptIn(
    tokenId: TokenId,
    agreementFlags: HexString32,
    signature: Signature,
  ): ResultAsync<void, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.restrictedOptIn(
        tokenId,
        agreementFlags,
        signature,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ConsentContractError(
          "Unable to call restrictedOptIn()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new ConsentContractError(
            "Wait for restrictedOptIn() failed",
            "Unknown",
            e,
          );
        });
      })
      .map(() => {});
  }

  public anonymousRestrictedOptIn(
    tokenId: TokenId,
    agreementFlags: HexString32,
    signature: Signature,
  ): ResultAsync<void, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.anonymousRestrictedOptIn(
        tokenId,
        agreementFlags,
        signature,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ConsentContractError(
          "Unable to call anonymousRestrictedOptIn()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new ConsentContractError(
            "Wait for anonymousRestrictedOptIn() failed",
            "Unknown",
            e,
          );
        });
      })
      .map(() => {});
  }

  public optOut(tokenId: TokenId): ResultAsync<void, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.optOut(
        tokenId,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ConsentContractError(
          "Unable to call optOut()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new ConsentContractError(
            "Wait for optOut() failed",
            "Unknown",
            e,
          );
        });
      })
      .map(() => {});
  }

  public encodeOptOut(tokenId: TokenId): HexString {
    return HexString(
      this.contract.interface.encodeFunctionData("optOut", [tokenId]),
    );
  }

  public agreementFlags(
    tokenId: TokenId,
  ): ResultAsync<HexString32, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.agreementFlagsArray(tokenId) as Promise<HexString32>,
      (e) => {
        return new ConsentContractError(
          "Unable to call agreementFlagsArray()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    );
  }

  public getMaxCapacity(): ResultAsync<number, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.maxCapacity() as Promise<BigNumber>,
      (e) => {
        return new ConsentContractError(
          "Unable to call maxCapacity()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map((bigCapacity) => {
      return bigCapacity.toNumber();
    });
  }

  public updateMaxCapacity(
    maxCapacity: number,
  ): ResultAsync<void, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.updateMaxCapacity(
        maxCapacity,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ConsentContractError(
          "Unable to call updateMaxCapacity()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new ConsentContractError(
            "Wait for updateMaxCapacity() failed",
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
            "Wait for requestForData() failed",
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
    ).map((numberOfTokens) => {
      return numberOfTokens.toNumber();
    });
  }

  public tokenURI(
    tokenId: TokenId,
  ): ResultAsync<TokenUri | null, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.tokenURI(tokenId) as Promise<TokenUri | null>,
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
      this.contract.queryFilter(eventFilter, fromBlock, toBlock) as Promise<
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

  // Returns all the past token ids generated for the user
  // Keep incase we ever want a list of previous token ids issued to the user even if they opted out
  public getConsentTokensOfAddress(
    ownerAddress: EVMAccountAddress,
  ): ResultAsync<ConsentToken[], ConsentContractError> {
    return this.balanceOf(ownerAddress).andThen((numberOfTokens) => {
      if (numberOfTokens === 0) {
        return okAsync([]);
      }
      return this.queryFilter(
        this.filters.Transfer(null, ownerAddress),
      ).andThen((logsEvents) => {
        return ResultUtils.combine(
          logsEvents.map((logEvent) => {
            if (logEvent.args == null || logEvent.args.tokenId == null) {
              return okAsync(null);
            }

            return this.agreementFlags(logEvent.args?.tokenId).andThen(
              (agreementFlag) => {
                return okAsync(
                  new ConsentToken(
                    this.contractAddress,
                    ownerAddress,
                    TokenId(logEvent.args?.tokenId?.toNumber()),
                    // TODO: DataPermissions
                    new DataPermissions(agreementFlag),
                  ),
                );
              },
            );
          }),
        ).map((consentTokens) => {
          return consentTokens.filter(
            (consentToken) => consentToken != null,
          ) as ConsentToken[];
        });
      });
    });
  }

  // Returns the current token id owned by the user
  public getCurrentConsentTokenOfAddress(
    ownerAddress: EVMAccountAddress,
  ): ResultAsync<ConsentToken | null, ConsentContractError> {
    return this.balanceOf(ownerAddress).andThen((numberOfTokens) => {
      if (numberOfTokens === 0) {
        return okAsync(null);
      }
      // this returns all the past Transfer events pertaining to this contract
      return this.queryFilter(
        this.filters.Transfer(null, ownerAddress),
      ).andThen((logsEvents) => {
        console.log("Transfer events log count", logsEvents.length);
        // Get only the last Transfer event (the latest opt in token id)
        const lastIndex = logsEvents.length - 1;

        // Get the agreement flags of the user's current consent token
        return this.agreementFlags(logsEvents[lastIndex].args?.tokenId).andThen(
          (agreementFlag) => {
            return okAsync(
              new ConsentToken(
                this.contractAddress,
                ownerAddress,
                TokenId(logsEvents[lastIndex].args?.tokenId?.toNumber()),
                // TODO: DataPermissions
                new DataPermissions(agreementFlag),
              ),
            );
          },
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

  public getDomains(): ResultAsync<DomainName[], ConsentContractError> {
    return ResultAsync.fromPromise(
      // returns array of domains
      this.contract.getDomains() as Promise<DomainName[]>,
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
    return this.queryFilter(
      this.filters.RequestForData(requesterAddress),
      fromBlock,
      toBlock,
    ).andThen((logsEvents) => {
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

  public disableOpenOptIn(): ResultAsync<void, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.disableOpenOptIn() as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ConsentContractError(
          "Unable to call disableOpenOptIn()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new ConsentContractError(
            "Wait for disableOpenOptIn() failed",
            "Unknown",
            e,
          );
        });
      })
      .map(() => {});
  }

  public enableOpenOptIn(): ResultAsync<void, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.enableOpenOptIn() as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ConsentContractError(
          "Unable to call enableOpenOptIn()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new ConsentContractError(
            "Wait for enableOpenOptIn() failed",
            "Unknown",
            e,
          );
        });
      })
      .map(() => {});
  }

  public baseURI(): ResultAsync<BaseURI, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.baseURI() as Promise<BaseURI>,
      (e) => {
        return new ConsentContractError(
          "Unable to call baseURI()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    );
  }

  public setBaseURI(baseUri: BaseURI): ResultAsync<void, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.setBaseURI(
        baseUri,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ConsentContractError(
          "Unable to call setBaseURI()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new ConsentContractError(
            "Wait for setBaseURI() failed",
            "Unknown",
            e,
          );
        });
      })
      .map(() => {});
  }

  public hasRole(
    role: keyof typeof ConsentRoles,
    address: EVMAccountAddress,
  ): ResultAsync<boolean, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.hasRole(ConsentRoles[role], address) as Promise<boolean>,
      (e) => {
        return new ConsentContractError(
          "Unable to call hasRole()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    );
  }

  public grantRole(
    role: keyof typeof ConsentRoles,
    address: EVMAccountAddress,
  ): ResultAsync<void, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.grantRole(
        ConsentRoles[role],
        address,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ConsentContractError(
          "Unable to call grantRole()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new ConsentContractError(
            "Wait for grantRole() failed",
            "Unknown",
            e,
          );
        });
      })
      .map(() => {});
  }

  public revokeRole(
    role: keyof typeof ConsentRoles,
    address: EVMAccountAddress,
  ): ResultAsync<void, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.revokeRole(
        ConsentRoles[role],
        address,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ConsentContractError(
          "Unable to call revokeRole()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new ConsentContractError(
            "Wait for revokeRole() failed",
            "Unknown",
            e,
          );
        });
      })
      .map(() => {});
  }

  public renounceRole(
    role: keyof typeof ConsentRoles,
    address: EVMAccountAddress,
  ): ResultAsync<void, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.renounceRole(
        ConsentRoles[role],
        address,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ConsentContractError(
          "Unable to call renounceRole()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new ConsentContractError(
            "Wait for renounceRole() failed",
            "Unknown",
            e,
          );
        });
      })
      .map(() => {});
  }

  public getQueryHorizon(): ResultAsync<BlockNumber, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.queryHorizon() as Promise<BigNumber>,
      (e) => {
        return new ConsentContractError(
          "Unable to call queryHorizon()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map((queryHorizon) => BlockNumber(queryHorizon.toNumber()));
  }

  public setQueryHorizon(
    blockNumber: BlockNumber,
  ): ResultAsync<void, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.setQueryHorizon(
        blockNumber,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ConsentContractError(
          "Unable to call setQueryHorizon()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new ConsentContractError(
            "Wait for setQueryHorizon() failed",
            "Unknown",
            e,
          );
        });
      })
      .map(() => {});
  }

  // Get the number of opted in addresses
  public totalSupply(): ResultAsync<number, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.totalSupply() as Promise<BigNumber>,
      (e) => {
        return new ConsentContractError(
          "Unable to call totalSupply()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map((totalSupply) => totalSupply.toNumber());
  }

  public filters = {
    Transfer: (
      fromAddress: EVMAccountAddress | null,
      toAddress: EVMAccountAddress | null,
    ): EventFilter => {
      return this.contract.filters.Transfer(fromAddress, toAddress);
    },
    RequestForData: (ownerAddress: EVMAccountAddress): EventFilter => {
      return this.contract.filters.RequestForData(ownerAddress);
    },
  };

  public getSignature(
    values: (
      | string
      | EVMAccountAddress
      | ethers.BigNumber
      | HexString
      | EVMContractAddress
    )[],
  ): ResultAsync<Signature, InvalidParametersError> {
    const types = ["address", "uint256"];
    return this.cryptoUtils.getSignature(
      this.providerOrSigner as ethers.providers.JsonRpcSigner,
      types,
      values,
    );
  }
}
