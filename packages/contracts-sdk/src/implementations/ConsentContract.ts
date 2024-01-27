import { ICryptoUtils } from "@snickerdoodlelabs/node-utils";
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
  DomainName,
  BaseURI,
  HexString,
  HexString32,
  InvalidParametersError,
  ConsentToken,
  DataPermissions,
  BigNumberString,
  BlockchainCommonErrors,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { ok, err, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IEthersContractError } from "@contracts-sdk/implementations/BlockchainErrorMapper.js";
import { ERC7529Contract } from "@contracts-sdk/implementations/ERC7529Contract.js";
import { IConsentContract } from "@contracts-sdk/interfaces/IConsentContract.js";
import {
  WrappedTransactionResponse,
  EConsentRoles,
  Tag,
  ContractOverrides,
  ContractsAbis,
} from "@contracts-sdk/interfaces/index.js";

@injectable()
export class ConsentContract
  extends ERC7529Contract<ConsentContractError>
  implements IConsentContract
{
  constructor(
    protected providerOrSigner:
      | ethers.Provider
      | ethers.JsonRpcSigner
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
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
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
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
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
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
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
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.writeToContract("optOut", [tokenId], overrides);
  }

  public encodeOptOut(tokenId: TokenId): HexString {
    return HexString(
      this.contract.interface.encodeFunctionData("optOut", [tokenId]),
    );
  }

  public agreementFlags(
    tokenId: TokenId,
  ): ResultAsync<HexString32, ConsentContractError | BlockchainCommonErrors> {
    return ResultAsync.fromPromise(
      this.contract.agreementFlagsArray(tokenId) as Promise<HexString32>,
      (e) => {
        return this.generateError(e, "Unable to call agreementFlagsArray()");
      },
    );
  }

  public getMaxCapacity(): ResultAsync<
    number,
    ConsentContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.maxCapacity() as Promise<bigint>,
      (e) => {
        return this.generateError(e, "Unable to call maxCapacity()");
      },
    ).map((bigCapacity) => {
      return Number(bigCapacity);
    });
  }

  public updateMaxCapacity(
    maxCapacity: number,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.writeToContract("updateMaxCapacity", [maxCapacity], overrides);
  }

  public updateAgreementFlags(
    tokenId: TokenId,
    newAgreementFlags: HexString32,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
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
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.writeToContract("requestForData", [ipfsCID], overrides);
  }

  // Returns the address Consent contract contract's owner
  // Note that the address on index 0 of the DEFAULT_ADMIN_ROLE members is the contract owner
  public getConsentOwner(): ResultAsync<
    EVMAccountAddress,
    ConsentContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getRoleMember(
        EConsentRoles.DEFAULT_ADMIN_ROLE,
        0,
      ) as Promise<EVMAccountAddress>,
      (e) => {
        return this.generateError(e, "Unable to call getRoleMember()");
      },
    );
  }

  // Returns an array of address that has the DEFAULT_ADMIN_ROLE on the Consent contract
  // Note that the address on index 0 is the contract owner
  public getDefaultAdminRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ConsentContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getRoleMemberCount(
        EConsentRoles.DEFAULT_ADMIN_ROLE,
      ) as Promise<bigint>,
      (e) => {
        return this.generateError(
          e,
          "Unable to call getDefaultAdminRoleMembers()",
        );
      },
    ).andThen((memberCount) => {
      // First get an array of index values so that it can be used with ResultUtils.combine
      const memberIndexArray: number[] = [];

      for (let i = 0; i < Number(memberCount); i++) {
        memberIndexArray.push(i);
      }

      // Map through each index value and get its role member address
      return ResultUtils.combine(
        memberIndexArray.map((index) => {
          return ResultAsync.fromPromise(
            this.contract.getRoleMember(
              EConsentRoles.DEFAULT_ADMIN_ROLE,
              index,
            ) as Promise<EVMAccountAddress>,
            (e) => {
              return this.generateError(e, "Unable to call getRoleMember()");
            },
          );
        }),
      );
    });
  }

  public getSignerRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ConsentContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getRoleMemberCount(
        EConsentRoles.SIGNER_ROLE,
      ) as Promise<bigint>,
      (e) => {
        return this.generateError(e, "Unable to call getSignerRoleMembers()");
      },
    ).andThen((memberCount) => {
      // First get an array of index values so that it can be used with ResultUtils.combine
      const memberIndexArray: number[] = [];

      for (let i = 0; i < Number(memberCount); i++) {
        memberIndexArray.push(i);
      }

      // Map through each index value and get its role member address
      return ResultUtils.combine(
        memberIndexArray.map((index) => {
          return ResultAsync.fromPromise(
            this.contract.getRoleMember(
              EConsentRoles.PAUSER_ROLE,
              index,
            ) as Promise<EVMAccountAddress>,
            (e) => {
              return this.generateError(
                e,
                "Unable to call getRoleMember() for SIGNER_ROLE",
              );
            },
          );
        }),
      );
    });
  }

  public getPauserRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ConsentContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getRoleMemberCount(
        EConsentRoles.PAUSER_ROLE,
      ) as Promise<bigint>,
      (e) => {
        return this.generateError(e, "Unable to call getPauserRoleMembers()");
      },
    ).andThen((memberCount) => {
      // First get an array of index values so that it can be used with ResultUtils.combine
      const memberIndexArray: number[] = [];

      for (let i = 0; i < Number(memberCount); i++) {
        memberIndexArray.push(i);
      }

      // Map through each index value and get its role member address
      return ResultUtils.combine(
        memberIndexArray.map((index) => {
          return ResultAsync.fromPromise(
            this.contract.getRoleMember(
              EConsentRoles.PAUSER_ROLE,
              index,
            ) as Promise<EVMAccountAddress>,
            (e) => {
              return this.generateError(
                e,
                "Unable to call getRoleMember() for PAUSER_ROLE",
              );
            },
          );
        }),
      );
    });
  }

  public getRequesterRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ConsentContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getRoleMemberCount(
        EConsentRoles.REQUESTER_ROLE,
      ) as Promise<bigint>,
      (e) => {
        return this.generateError(
          e,
          "Unable to call getRequesterRoleMembers()",
        );
      },
    ).andThen((memberCount) => {
      // First get an array of index values so that it can be used with ResultUtils.combine
      const memberIndexArray: number[] = [];

      for (let i = 0; i < Number(memberCount); i++) {
        memberIndexArray.push(i);
      }

      // Map through each index value and get its role member address
      return ResultUtils.combine(
        memberIndexArray.map((index) => {
          return ResultAsync.fromPromise(
            this.contract.getRoleMember(
              EConsentRoles.REQUESTER_ROLE,
              index,
            ) as Promise<EVMAccountAddress>,
            (e) => {
              return this.generateError(
                e,
                "Unable to call getRoleMember() for REQUESTER_ROLE",
              );
            },
          );
        }),
      );
    });
  }

  public balanceOf(
    address: EVMAccountAddress,
  ): ResultAsync<number, ConsentContractError | BlockchainCommonErrors> {
    return ResultAsync.fromPromise(
      this.contract.balanceOf(address) as Promise<bigint>,
      (e) => {
        return this.generateError(e, "Unable to call balanceOf()");
      },
    ).map((numberOfTokens) => {
      return Number(numberOfTokens);
    });
  }

  public ownerOf(
    tokenId: TokenId,
  ): ResultAsync<
    EVMAccountAddress,
    ConsentContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.ownerOf(tokenId) as Promise<EVMAccountAddress>,
      (e) => {
        return this.generateError(e, "Unable to call ownerOf()");
      },
    );
  }

  public tokenURI(
    tokenId: TokenId,
  ): ResultAsync<
    TokenUri | null,
    ConsentContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.tokenURI(tokenId) as Promise<TokenUri | null>,
      (e) => {
        return this.generateError(e, "Unable to call tokenURI()");
      },
    ).orElse((error) => {
      // The contract reverts with this message if tokenId does not exist
      if (
        (error as any).reason === "ERC721: operator query for nonexistent token"
      ) {
        return ok(null);
      }
      return err(error);
    });
  }

  public queryFilter(
    eventFilter: ethers.ContractEventName,
    fromBlock?: BlockNumber,
    toBlock?: BlockNumber,
  ): ResultAsync<
    (ethers.EventLog | ethers.Log)[],
    ConsentContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.queryFilter(eventFilter, fromBlock, toBlock) as Promise<
        (ethers.EventLog | ethers.Log)[]
      >,
      (e) => {
        return this.generateError(e, "Unable to call queryFilter()");
      },
    );
  }

  public getConsentToken(
    tokenId: TokenId,
  ): ResultAsync<ConsentToken, ConsentContractError | BlockchainCommonErrors> {
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
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.writeToContract("addDomain", [domain], overrides);
  }

  public removeDomain(
    domain: DomainName,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.writeToContract("removeDomain", [domain], overrides);
  }

  public getDomains(): ResultAsync<
    DomainName[],
    ConsentContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      // returns array of domains
      this.contract.getDomains() as Promise<DomainName[]>,
      (e) => {
        return this.generateError(e, "Unable to call getDomains()");
      },
    );
  }

  // #region Questionnaires
  public getQuestionnaires(): ResultAsync<
    Map<number, IpfsCID>,
    ConsentContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getQuestionnaires() as Promise<IpfsCID[]>,
      (e) => {
        return this.generateError(e, "Unable to call getQuestionnaires()");
      },
    ).map((questionnaires) => {
      // Convert to a map
      const questionnaireMap = new Map<number, IpfsCID>();
      for (let index = 0; index < 64; index++) {
        // Get the questionnaire at index i
        const questionnaire = questionnaires[index];

        // Only add non-empty indexes to the return map.
        if (questionnaire != "") {
          questionnaireMap.set(index, questionnaire);
        }
      }
      return questionnaireMap;
    });
  }

  public setQuestionnaire(
    index: number,
    ipfsCid: IpfsCID,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.writeToContract(
      "setQuestionnaire",
      [index, ipfsCid],
      overrides,
    );
  }

  public removeQuestionnaire(
    index: number,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.writeToContract("removeQuestionnaire", [index], overrides);
  }
  // #endregion Questionnaires

  public getRequestForDataListByRequesterAddress(
    requesterAddress: EVMAccountAddress,
    fromBlock?: BlockNumber,
    toBlock?: BlockNumber,
  ): ResultAsync<
    RequestForData[],
    ConsentContractError | BlockchainCommonErrors
  > {
    return this.queryFilter(
      this.filters.RequestForData(requesterAddress),
      fromBlock,
      toBlock,
    ).map((logsEvents) => {
      return logsEvents.reduce((acc, logEvent) => {
        if (logEvent instanceof ethers.EventLog) {
          acc.push(
            new RequestForData(
              this.getContractAddress(),
              logEvent.args.requester,
              logEvent.args.ipfsCID,
              BlockNumber(logEvent.blockNumber),
            ),
          );
        }
        return acc;
      }, new Array<RequestForData>());
    });
  }

  public getLatestTokenIdByOptInAddress(
    optInAddress: EVMAccountAddress,
  ): ResultAsync<
    TokenId | null,
    ConsentContractError | BlockchainCommonErrors
  > {
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

      if (latestOptinEvent instanceof ethers.EventLog) {
        if (latestOptinEvent.args.tokenId != null) {
          return TokenId(latestOptinEvent.args.tokenId);
        }
      }

      return null;
    });
  }

  public disableOpenOptIn(
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.writeToContract("disableOpenOptIn", [], overrides);
  }

  public enableOpenOptIn(
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.writeToContract("enableOpenOptIn", [], overrides);
  }

  public baseURI(): ResultAsync<
    BaseURI,
    ConsentContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.baseURI() as Promise<BaseURI>,
      (e) => {
        return this.generateError(e, "Unable to call baseURI()");
      },
    );
  }

  public setBaseURI(
    baseUri: BaseURI,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.writeToContract("setBaseURI", [baseUri], overrides);
  }

  public hasRole(
    role: EConsentRoles,
    address: EVMAccountAddress,
  ): ResultAsync<boolean, ConsentContractError | BlockchainCommonErrors> {
    return ResultAsync.fromPromise(
      this.contract.hasRole(EConsentRoles[role], address) as Promise<boolean>,
      (e) => {
        return this.generateError(e, "Unable to call hasRole()");
      },
    );
  }

  public grantRole(
    role: EConsentRoles,
    address: EVMAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.writeToContract("grantRole", [role, address], overrides);
  }

  public revokeRole(
    role: EConsentRoles,
    address: EVMAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.writeToContract("revokeRole", [role, address], overrides);
  }

  public renounceRole(
    role: EConsentRoles,
    address: EVMAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.writeToContract("renounceRole", [role, address], overrides);
  }

  public getQueryHorizon(): ResultAsync<
    BlockNumber,
    ConsentContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.queryHorizon() as Promise<bigint>,
      (e) => {
        return this.generateError(e, "Unable to call queryHorizon()");
      },
    ).map((queryHorizon) => BlockNumber(Number(queryHorizon)));
  }

  public setQueryHorizon(
    blockNumber: BlockNumber,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.writeToContract("setQueryHorizon", [blockNumber], overrides);
  }

  public estimateGasLimitForSetQueryHorizon(
    blockNumber: BlockNumber,
    overrides?: ContractOverrides,
  ): ResultAsync<
    BigNumberString,
    BlockchainCommonErrors | ConsentContractError
  > {
    return ResultAsync.fromPromise(
      this.contract.estimateGas["setQueryHorizon"](blockNumber, {
        overrides,
      }) as Promise<bigint>,
      (e) => this.generateError(e, `Failed to estimate gas with error: ${e}`),
    ).map((bnGas) => {
      return BigNumberString(bnGas.toString());
    });
  }

  // Get the number of opted in addresses
  public totalSupply(): ResultAsync<
    number,
    ConsentContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.totalSupply() as Promise<bigint>,
      (e) => {
        return this.generateError(e, "Unable to call totalSupply()");
      },
    ).map((totalSupply) => Number(totalSupply));
  }

  public openOptInDisabled(): ResultAsync<
    boolean,
    ConsentContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.openOptInDisabled() as Promise<boolean>,
      (e) => {
        return this.generateError(e, "Unable to call openOptInDisabled()");
      },
    );
  }

  // Marketplace functions
  public getMaxTags(): ResultAsync<
    number,
    ConsentContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.maxTags() as Promise<bigint>,
      (e) => {
        return this.generateError(e, "Unable to call maxTags()");
      },
    ).map((num) => {
      return Number(num);
    });
  }

  public getNumberOfStakedTags(): ResultAsync<
    number,
    ConsentContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getNumberOfStakedTags() as Promise<bigint>,
      (e) => {
        return this.generateError(e, "Unable to call getNumberOfStakedTags()");
      },
    ).map((num) => {
      return Number(num);
    });
  }

  public getTagArray(): ResultAsync<
    Tag[],
    ConsentContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getTagArray() as Promise<ITagStruct[]>,
      (e) => {
        return this.generateError(e, "Unable to call getTagArray()");
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
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
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
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
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
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
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
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.writeToContract(
      "replaceExpiredListing",
      [tag, stakeAmount],
      overrides,
    );
  }

  public removeListing(
    tag: string,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.writeToContract("removeListing", [tag], overrides);
  }

  public filters = {
    Transfer: (
      fromAddress: EVMAccountAddress | null,
      toAddress: EVMAccountAddress | null,
    ): ethers.DeferredTopicFilter => {
      return this.contract.filters.Transfer(fromAddress, toAddress);
    },
    RequestForData: (
      ownerAddress: EVMAccountAddress,
    ): ethers.DeferredTopicFilter => {
      return this.contract.filters.RequestForData(ownerAddress);
    },
  };

  public getSignature(
    values: (
      | string
      | EVMAccountAddress
      | bigint
      | HexString
      | EVMContractAddress
    )[],
  ): ResultAsync<Signature, InvalidParametersError> {
    const types = ["address", "uint256"];
    return this.cryptoUtils.getSignature(
      this.providerOrSigner as ethers.JsonRpcSigner,
      types,
      values,
    );
  }

  protected generateContractSpecificError(
    msg: string,
    e: IEthersContractError,
    transaction: ethers.Transaction | null,
  ): ConsentContractError {
    return new ConsentContractError(msg, e, transaction);
  }
}

interface ITagStruct {
  slot: bigint | null;
  tag: string | null;
  staker: EVMAccountAddress | null;
}
