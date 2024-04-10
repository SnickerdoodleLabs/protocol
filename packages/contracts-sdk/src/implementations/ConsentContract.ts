import { ICryptoUtils } from "@snickerdoodlelabs/node-utils";
import {
  ConsentContractError,
  EVMAccountAddress,
  EVMContractAddress,
  IpfsCID,
  Signature,
  TokenId,
  RequestForData,
  BlockNumber,
  DomainName,
  BaseURI,
  HexString,
  InvalidParametersError,
  BigNumberString,
  BlockchainCommonErrors,
  Commitment,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { okAsync, ResultAsync, errAsync } from "neverthrow";
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
    protected providerOrSigner: ethers.Provider | ethers.Signer,
    protected contractAddress: EVMContractAddress,
    protected cryptoUtils: ICryptoUtils,
  ) {
    super(providerOrSigner, contractAddress, ContractsAbis.ConsentAbi.abi);
  }

  public getContractAddress(): EVMContractAddress {
    return this.contractAddress;
  }

  public optIn(
    commitment: Commitment,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.writeToContract(
      "optIn",
      [ethers.toBeArray(commitment)],
      overrides,
    );
  }

  public batchOptIn(
    commitments: Commitment[],
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.writeToContract(
      "optIn",
      commitments.map((commitment) => ethers.toBeArray(commitment)),
      overrides,
    );
  }

  public restrictedOptIn(
    commitment: Commitment,
    nonce: TokenId,
    signature: Signature,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.writeToContract(
      "restrictedOptIn",
      [nonce, ethers.toBeArray(commitment), signature],
      overrides,
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

  public checkDomain(
    domain: DomainName,
  ): ResultAsync<boolean, ConsentContractError | BlockchainCommonErrors> {
    return ResultAsync.fromPromise(
      // returns array of domains
      this.contract.checkDomain(domain) as Promise<boolean>,
      (e) => {
        return this.generateError(e, "Unable to call checkDomain()");
      },
    );
  }

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

  public getRequestForDataList(
    fromBlock?: BlockNumber,
    toBlock?: BlockNumber,
  ): ResultAsync<
    RequestForData[],
    ConsentContractError | BlockchainCommonErrors
  > {
    return this.queryFilter(
      this.filters.RequestForDataNoOwner(),
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

  public checkCommitments(
    commitments: Commitment[],
  ): ResultAsync<number[], ConsentContractError | BlockchainCommonErrors> {
    // Returns the indexes of the commitments. 0 means the commitment is invalid.
    // The commitment is just a bigint, but it is less than 32 bytes. We need to convert it to a bytes32
    return ResultAsync.fromPromise(
      this.contract.checkCommitments(
        commitments.map((commitment) => {
          return ethers.toBeArray(commitment);
        }),
      ) as Promise<bigint[]>,
      (e) => {
        return this.generateError(e, "Unable to call checkCommitments()");
      },
    ).andThen((indexes) => {
      // Indexes should be the same size as commitments. If not, something went wrong
      if (commitments.length != indexes.length) {
        return errAsync(
          new ConsentContractError(
            "Invalid response from checkCommitments(), returned index length does not match the length of the requested commitments",
            null,
            null,
          ),
        );
      }

      // If if the index is not 0, then the commitment is valid
      return okAsync(
        indexes.map((index) => {
          return Number(index);
        }),
      );
    });
  }

  public checkNonces(
    nonces: TokenId[],
  ): ResultAsync<boolean[], ConsentContractError | BlockchainCommonErrors> {
    return ResultAsync.fromPromise(
      this.contract.checkNonces(nonces) as Promise<boolean[]>,
      (e) => {
        return this.generateError(e, "Unable to call checkNonces()");
      },
    );
  }

  public fetchAnonymitySet(
    start: BigNumberString,
    stop: BigNumberString,
  ): ResultAsync<Commitment[], BlockchainCommonErrors | ConsentContractError> {
    return ResultAsync.fromPromise(
      this.contract.fetchAnonymitySet(start, stop) as Promise<string[]>,
      (e) => {
        return this.generateError(e, "Unable to call fetchAnonymitySet()");
      },
    ).map((commitmentBytes) => {
      return commitmentBytes.map((commitment) => {
        return Commitment(ethers.toBigInt(commitment));
      });
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

  //#region Staking
  // TODO remove
  public getStakingToken(): ResultAsync<
    EVMContractAddress,
    ConsentContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getStakingToken() as Promise<EVMContractAddress>,
      (e) => {
        return this.generateError(e, "Unable to call getStakingToken()");
      },
    );
  }

  //#region Content
  public tagIndices(
    tag: string,
    stakingToken: EVMContractAddress,
  ): ResultAsync<
    BigNumberString,
    ConsentContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.tagIndices(tag, stakingToken) as Promise<bigint>,
      (e) => {
        return this.generateError(e, "Unable to call tagIndices()");
      },
    ).map((index) => {
      return BigNumberString(index.toString());
    });
  }

  public getNumberOfStakedTags(
    stakingToken: EVMContractAddress,
  ): ResultAsync<number, ConsentContractError | BlockchainCommonErrors> {
    return ResultAsync.fromPromise(
      this.contract.getNumberOfStakedTags(stakingToken) as Promise<bigint>,
      (e) => {
        return this.generateError(e, "Unable to call getNumberOfStakedTags()");
      },
    ).map((num) => {
      return Number(num);
    });
  }

  public getTagArray(
    stakingToken: EVMContractAddress,
  ): ResultAsync<Tag[], ConsentContractError | BlockchainCommonErrors> {
    return ResultAsync.fromPromise(
      this.contract.getTagArray(stakingToken) as Promise<ITagStruct[]>,
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

  public getContentAddress(): ResultAsync<
    EVMContractAddress,
    ConsentContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getContentAddress() as Promise<EVMContractAddress>,
      (e) => {
        return this.generateError(e, "Unable to call getContentAddress()");
      },
    );
  }
  //#endregion Content

  //#region Consent
  public depositStake(
    depositToken: EVMContractAddress,
    amount: BigNumberString,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.writeToContract(
      "depositStake",
      [depositToken, amount],
      overrides,
    );
  }

  public removeStake(
    depositToken: EVMContractAddress,
    amount: BigNumberString,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.writeToContract(
      "removeStake",
      [depositToken, amount],
      overrides,
    );
  }

  public newGlobalTag(
    tag: string,
    stakingToken: EVMContractAddress,
    stakeAmount: BigNumberString,
    stakeSlot: BigNumberString,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.writeToContract(
      "newGlobalTag",
      [tag, stakingToken, stakeAmount, stakeSlot],
      overrides,
    );
  }

  public newLocalTagUpstream(
    tag: string,
    stakingToken: EVMContractAddress,
    stakeAmount: BigNumberString,
    newSlot: BigNumberString,
    existingSlot: BigNumberString,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.writeToContract(
      "newLocalTagUpstream",
      [tag, stakingToken, stakeAmount, newSlot, existingSlot],
      overrides,
    );
  }

  public newLocalTagDownstream(
    tag: string,
    stakingToken: EVMContractAddress,
    stakeAmount: BigNumberString,
    existingSlot: BigNumberString,
    newSlot: BigNumberString,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.writeToContract(
      "newLocalTagDownstream",
      [tag, stakingToken, stakeAmount, existingSlot, newSlot],
      overrides,
    );
  }

  public moveExistingListingUpstream(
    tag: string,
    stakingToken: EVMContractAddress,
    stakeAmount: BigNumberString,
    newSlot: BigNumberString,
    existingSlot: BigNumberString,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.writeToContract(
      "moveExistingListingUpstream",
      [tag, stakingToken, stakeAmount, newSlot, existingSlot],
      overrides,
    );
  }

  public restakeExpiredListing(
    tag: string,
    stakingToken: EVMContractAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.writeToContract(
      "restakeExpiredListing",
      [tag, stakingToken],
      overrides,
    );
  }

  public replaceExpiredListing(
    tag: string,
    stakingToken: EVMContractAddress,
    stakeAmount: BigNumberString,
    stakeSlot: BigNumberString,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.writeToContract(
      "replaceExpiredListing",
      [tag, stakingToken, stakeAmount, stakeSlot],
      overrides,
    );
  }

  public removeListing(
    tag: string,
    stakingToken: EVMContractAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.writeToContract(
      "removeListing",
      [tag, stakingToken],
      overrides,
    );
  }
  //#endregion Consent
  //#endregion Staking

  public pause(
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.writeToContract("pause", [], overrides);
  }

  public unpause(
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    return this.writeToContract("unpause", [], overrides);
  }

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
    RequestForDataNoOwner: (): ethers.DeferredTopicFilter => {
      return this.contract.filters.RequestForData();
    },
  };

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
