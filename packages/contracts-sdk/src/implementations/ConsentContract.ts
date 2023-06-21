import { BaseContract } from "@contracts-sdk/implementations/BaseContract.js";
import { IConsentContract } from "@contracts-sdk/interfaces/IConsentContract";
import {
  WrappedTransactionResponse,
  ConsentRoles,
  Tag,
  ContractOverrides,
  ContractsAbis,
} from "@contracts-sdk/interfaces/objects";
import { ICryptoUtils } from "@snickerdoodlelabs/common-utils";
import {
  ConsentContractError,
  EVMAccountAddress,
  EVMContractAddress,
  IpfsCID,
  TokenUri,
  Signature,
  TokenId,
  RequestForData,
  BlockNumber,
  IBlockchainError,
  DomainName,
  BaseURI,
  HexString,
  HexString32,
  InvalidParametersError,
  ConsentToken,
  DataPermissions,
  BigNumberString,
} from "@snickerdoodlelabs/objects";
import { ethers, EventFilter, Event, BigNumber } from "ethers";
import { injectable } from "inversify";
import { ok, err, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

@injectable()
export class ConsentContract
  extends BaseContract<ConsentContractError>
  implements IConsentContract
{
  constructor(
    protected providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
    protected contractAddress: EVMContractAddress,
    protected cryptoUtils: ICryptoUtils,
  ) {
    super(providerOrSigner, contractAddress, ContractsAbis.ConsentAbi.abi);
  }

  public getContractAddress(): EVMContractAddress {
    return this.contractAddress;
  }

  public optIn(
    tokenId: TokenId,
    agreementFlags: HexString32,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError> {
    return this.writeToContract("optIn", [tokenId, agreementFlags], overrides);
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

  public restrictedOptIn(
    tokenId: TokenId,
    agreementFlags: HexString32,
    signature: Signature,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError> {
    return this.writeToContract(
      "restrictedOptIn",
      [tokenId, agreementFlags, signature],
      overrides,
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

  public anonymousRestrictedOptIn(
    tokenId: TokenId,
    agreementFlags: HexString32,
    signature: Signature,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError> {
    return this.writeToContract(
      "anonymousRestrictedOptIn",
      [tokenId, agreementFlags, signature],
      overrides,
    );
  }

  public encodeAnonymousRestrictedOptIn(
    tokenId: TokenId,
    signature: Signature,
    agreementFlags: HexString32,
  ): HexString {
    return HexString(
      this.contract.interface.encodeFunctionData("anonymousRestrictedOptIn", [
        tokenId,
        agreementFlags,
        signature,
      ]),
    );
  }

  public optOut(
    tokenId: TokenId,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError> {
    return this.writeToContract("optOut", [tokenId], overrides);
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
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError> {
    return this.writeToContract("updateMaxCapacity", [maxCapacity], overrides);
  }

  public updateAgreementFlags(
    tokenId: TokenId,
    newAgreementFlags: HexString32,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError> {
    return this.writeToContract(
      "updateAgreementFlags",
      [tokenId, newAgreementFlags],
      overrides,
    );
  }

  public encodeUpdateAgreementFlags(
    tokenId: TokenId,
    agreementFlags: HexString32,
  ): HexString {
    return HexString(
      this.contract.interface.encodeFunctionData("updateAgreementFlags", [
        tokenId,
        agreementFlags,
      ]),
    );
  }

  public requestForData(
    ipfsCID: IpfsCID,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError> {
    return this.writeToContract("requestForData", [ipfsCID], overrides);
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

  public ownerOf(
    tokenId: TokenId,
  ): ResultAsync<EVMAccountAddress, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.ownerOf(tokenId) as Promise<EVMAccountAddress>,
      (e) => {
        return new ConsentContractError(
          "Unable to call ownerOf()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    );
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

  public getConsentToken(
    tokenId: TokenId,
  ): ResultAsync<ConsentToken, ConsentContractError> {
    // Get the agreement flags of the user's current consent token
    return ResultUtils.combine([
      this.ownerOf(tokenId),
      this.agreementFlags(tokenId),
    ]).andThen(([ownerAddress, agreementFlags]) => {
      return okAsync(
        new ConsentToken(
          this.contractAddress,
          ownerAddress,
          tokenId,
          new DataPermissions(agreementFlags),
        ),
      );
    });
  }

  public addDomain(
    domain: DomainName,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError> {
    return this.writeToContract("addDomain", [domain], overrides);
  }

  public removeDomain(
    domain: DomainName,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError> {
    return this.writeToContract("removeDomain", [domain], overrides);
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

  public getLatestTokenIdByOptInAddress(
    optInAddress: EVMAccountAddress,
  ): ResultAsync<TokenId | null, ConsentContractError> {
    return this.queryFilter(
      this.filters.Transfer(null, optInAddress),
      undefined,
      undefined,
    ).map((logsEvents) => {
      if (logsEvents.length == 0) {
        return null;
      }

      const latestOptinEvent = logsEvents.reduce(
        (latestEvent, logEvent) =>
          logEvent.blockNumber > latestEvent.blockNumber
            ? logEvent
            : latestEvent,
        logsEvents[0],
      );

      if (latestOptinEvent.args && latestOptinEvent.args.tokenId) {
        return TokenId(latestOptinEvent.args.tokenId);
      }

      return null;
    });
  }

  public disableOpenOptIn(
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError> {
    return this.writeToContract("disableOpenOptIn", [], overrides);
  }

  public enableOpenOptIn(
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError> {
    return this.writeToContract("enableOpenOptIn", [], overrides);
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

  public setBaseURI(
    baseUri: BaseURI,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError> {
    return this.writeToContract("setBaseURI", [baseUri], overrides);
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
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError> {
    return this.writeToContract("grantRole", [role, address], overrides);
  }

  public revokeRole(
    role: keyof typeof ConsentRoles,
    address: EVMAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError> {
    return this.writeToContract("revokeRole", [role, address], overrides);
  }

  public renounceRole(
    role: keyof typeof ConsentRoles,
    address: EVMAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError> {
    return this.writeToContract("renounceRole", [role, address], overrides);
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
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError> {
    return this.writeToContract("setQueryHorizon", [blockNumber], overrides);
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

  public openOptInDisabled(): ResultAsync<boolean, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.openOptInDisabled() as Promise<boolean>,
      (e) => {
        return new ConsentContractError(
          "Unable to call openOptInDisabled()",
          "Unknown",
          e,
        );
      },
    );
  }

  // Marketplace functions
  public getMaxTags(): ResultAsync<number, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.maxTags() as Promise<BigNumber>,
      (e) => {
        return new ConsentContractError(
          "Unable to call openOptInDisabled()",
          "Unknown",
          e,
        );
      },
    ).map((num) => {
      return num.toNumber();
    });
  }

  public getNumberOfStakedTags(): ResultAsync<number, ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.getNumberOfStakedTags() as Promise<BigNumber>,
      (e) => {
        return new ConsentContractError(
          "Unable to call getNumberOfStakedTags()",
          "Unknown",
          e,
        );
      },
    ).map((num) => {
      return num.toNumber();
    });
  }

  public getTagArray(): ResultAsync<Tag[], ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.getTagArray() as Promise<ITagStruct[]>,
      (e) => {
        return new ConsentContractError(
          "Unable to call getTagArray()",
          "Unknown",
          e,
        );
      },
    ).map((tags) => {
      return tags.map((tag) => {
        return new Tag(
          tag.slot ? BigNumberString(tag.slot.toString()) : null,
          tag.tag,
          tag.staker,
        );
      });
    });
  }

  public newGlobalTag(
    tag: string,
    newStakeAmount: BigNumberString,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError> {
    return this.writeToContract(
      "newGlobalTag",
      [tag, newStakeAmount],
      overrides,
    );
  }

  public newLocalTagUpstream(
    tag: string,
    newStakeAmount: BigNumberString,
    existingStakeAmount: BigNumberString,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError> {
    return this.writeToContract(
      "newLocalTagUpstream",
      [tag, newStakeAmount, existingStakeAmount],
      overrides,
    );
  }

  public newLocalTagDownstream(
    tag: string,
    existingStakeAmount: BigNumberString,
    newStakeAmount: BigNumberString,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError> {
    return this.writeToContract(
      "newLocalTagDownstream",
      [tag, existingStakeAmount, newStakeAmount],
      overrides,
    );
  }

  public replaceExpiredListing(
    tag: string,
    stakeAmount: BigNumberString,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError> {
    return this.writeToContract(
      "replaceExpiredListing",
      [tag, stakeAmount],
      overrides,
    );
  }

  public removeListing(
    tag: string,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError> {
    return this.writeToContract("removeListing", [tag], overrides);
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

  protected generateError(
    msg: string,
    reason: string | undefined,
    e: unknown,
  ): ConsentContractError {
    return new ConsentContractError(msg, reason, e);
  }
}

interface ITagStruct {
  slot: BigNumber | null;
  tag: string | null;
  staker: EVMAccountAddress | null;
}
