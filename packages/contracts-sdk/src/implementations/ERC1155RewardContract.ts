import {
  EVMAccountAddress,
  EVMContractAddress,
  TokenUri,
  TokenId,
  BaseURI,
  ERC1155ContractError,
  BlockchainCommonErrors,
  DomainName,
  TokenAmount,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync, okAsync, errAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { BaseContract } from "@contracts-sdk/implementations/BaseContract.js";
import { IEthersContractError } from "@contracts-sdk/implementations/BlockchainErrorMapper.js";
import { ERewardRoles } from "@contracts-sdk/interfaces/enums/ERewardRoles.js";
import {
  ContractOverrides,
  IERC1155RewardContract,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/index.js";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/index.js";

@injectable()
export class ERC1155RewardContract
  extends BaseContract<ERC1155ContractError>
  implements IERC1155RewardContract
{
  constructor(
    protected providerOrSigner: ethers.Provider | ethers.Signer,
    protected contractAddress: EVMContractAddress,
  ) {
    super(providerOrSigner, contractAddress, ContractsAbis.ERC1155Reward.abi);
  }

  public getContractAddress(): EVMContractAddress {
    return this.contractAddress;
  }

  public getOwner(): ResultAsync<
    EVMAccountAddress,
    ERC1155ContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getRoleMember(
        ERewardRoles.DEFAULT_ADMIN_ROLE,
        0,
      ) as Promise<EVMAccountAddress>,
      (e) => {
        return this.generateError(e, "Unable to call getRoleMember()");
      },
    );
  }

  // Returns an array of address that has the DEFAULT_ADMIN_ROLE on the Reward contract
  // Note that the address on index 0 is the contract owner
  public getDefaultAdminRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ERC1155ContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getRoleMemberCount(
        ERewardRoles.DEFAULT_ADMIN_ROLE,
      ) as Promise<bigint>,
      (e) => {
        return this.generateError(
          e,
          "Unable to call getDefaultAdminRoleMembers()",
        );
      },
    ).andThen((memberCount) => {
      // First get an array of index values so that it can be used with ResultUtils.combine
      const memberIndexArray: bigint[] = [];

      for (let i = 0n; i < memberCount; i++) {
        memberIndexArray.push(i);
      }

      // Map through each index value and get its role member address
      return ResultUtils.combine(
        memberIndexArray.map((index) => {
          return ResultAsync.fromPromise(
            this.contract.getRoleMember(
              ERewardRoles.DEFAULT_ADMIN_ROLE,
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

  public getMinterRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ERC1155ContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getRoleMemberCount(
        ERewardRoles.MINTER_ROLE,
      ) as Promise<bigint>,
      (e) => {
        return this.generateError(e, "Unable to call getSignerRoleMembers()");
      },
    ).andThen((memberCount) => {
      // First get an array of index values so that it can be used with ResultUtils.combine
      const memberIndexArray: bigint[] = [];

      for (let i = 0n; i < memberCount; i++) {
        memberIndexArray.push(i);
      }

      // Map through each index value and get its role member address
      return ResultUtils.combine(
        memberIndexArray.map((index) => {
          return ResultAsync.fromPromise(
            this.contract.getRoleMember(
              ERewardRoles.MINTER_ROLE,
              index,
            ) as Promise<EVMAccountAddress>,
            (e) => {
              return this.generateError(
                e,
                "Unable to call getRoleMember() for MINTER_ROLE",
              );
            },
          );
        }),
      );
    });
  }

  public tokenURI(
    tokenId: TokenId,
  ): ResultAsync<TokenUri, ERC1155ContractError | BlockchainCommonErrors> {
    return ResultAsync.fromPromise(
      this.contract.uri(tokenId) as Promise<TokenUri>,
      (e) => {
        return this.generateError(e, "Unable to call uri()");
      },
    );
  }

  public setTokenURI(
    tokenId: TokenId,
    newURI: TokenUri,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ERC1155ContractError
  > {
    return this.writeToContract("setTokenURI", [tokenId, newURI], overrides);
  }

  public balanceOf(
    address: EVMAccountAddress | EVMContractAddress,
    tokenId: TokenId,
  ): ResultAsync<number, ERC1155ContractError | BlockchainCommonErrors> {
    return ResultAsync.fromPromise(
      this.contract.balanceOf(address, tokenId) as Promise<bigint>,
      (e) => {
        return this.generateError(e, "Unable to call balanceOf()");
      },
    ).map((numberOfTokens) => {
      return Number(numberOfTokens);
    });
  }

  public balanceOfBatch(
    addresses: EVMAccountAddress[] | EVMContractAddress[],
    tokenIds: TokenId[],
  ): ResultAsync<number[], ERC1155ContractError | BlockchainCommonErrors> {
    return ResultAsync.fromPromise(
      this.contract.balanceOfBatch(addresses, tokenIds) as Promise<bigint[]>,
      (e) => {
        return this.generateError(e, "Unable to call balanceOfBatch()");
      },
    ).map((numberOfTokens) => {
      return numberOfTokens.map((number) => {
        return Number(numberOfTokens);
      });
    });
  }

  public hasRole(
    role: keyof typeof ERewardRoles,
    address: EVMAccountAddress,
  ): ResultAsync<boolean, ERC1155ContractError | BlockchainCommonErrors> {
    return ResultAsync.fromPromise(
      this.contract.hasRole(ERewardRoles[role], address) as Promise<boolean>,
      (e) => {
        return this.generateError(e, "Unable to call hasRole()");
      },
    );
  }

  public grantRole(
    role: keyof typeof ERewardRoles,
    address: EVMAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ERC1155ContractError
  > {
    return this.writeToContract(
      "grantRole",
      [ERewardRoles[role], address],
      overrides,
    );
  }

  public revokeRole(
    role: keyof typeof ERewardRoles,
    address: EVMAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ERC1155ContractError
  > {
    return this.writeToContract(
      "revokeRole",
      [ERewardRoles[role], address],
      overrides,
    );
  }

  public renounceRole(
    role: keyof typeof ERewardRoles,
    address: EVMAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ERC1155ContractError
  > {
    return this.writeToContract(
      "renounceRole",
      [ERewardRoles[role], address],
      overrides,
    );
  }

  public addDomain(
    domain: DomainName,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ERC1155ContractError
  > {
    return this.writeToContract("addDomain", [domain], overrides);
  }

  public removeDomain(
    domain: DomainName,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ERC1155ContractError
  > {
    return this.writeToContract("removeDomain", [domain], overrides);
  }

  public getDomains(): ResultAsync<
    DomainName[],
    BlockchainCommonErrors | ERC1155ContractError
  > {
    return ResultAsync.fromPromise(
      // returns array of domains
      this.contract.getDomains() as Promise<DomainName[]>,
      (e) => {
        return this.generateError(e, "Unable to call getDomains()");
      },
    );
  }

  // ===== Start: Functions to support testing pre-mint NFTs =====

  // ERC1155 contracts also have the same setApproveForAll function
  public isApprovedForAll(
    tokenOwnerAddress: EVMAccountAddress,
    operatorToApprove: EVMAccountAddress,
  ): ResultAsync<boolean, ERC1155ContractError | BlockchainCommonErrors> {
    return ResultAsync.fromPromise(
      this.contract.isApprovedForAll(
        tokenOwnerAddress,
        operatorToApprove,
      ) as Promise<boolean>,
      (e) => {
        return this.generateError(e, "Unable to call isApprovedForAll()");
      },
    );
  }

  // NOTE: To support this, the user would need to connect their external wallet that owns the NFTs to sign the approval txs
  public setApproveForAll(
    addressToApprove: EVMAccountAddress | EVMContractAddress,
    approved: boolean,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ERC1155ContractError
  > {
    return this.writeToContract(
      "setApproveForAll",
      [addressToApprove, approved],
      overrides,
    );
  }

  // Function that the escrow wallet will call to transfer NFTs from ERC1155 rewards after they are approved
  // Note: Unlike setApproveForAll, ERC1155's ABI for safeTransferFrom only supports ERC721 as ERC1155's safeTransferFrom function takes additional parameters, refer to:
  // ERC721 : https://docs.openzeppelin.com/contracts/5.x/api/token/erc721#IERC721-safeTransferFrom-address-address-uint256-
  // ERC1155 : https://docs.openzeppelin.com/contracts/5.x/api/token/erc1155#IERC1155-safeTransferFrom-address-address-uint256-uint256-bytes-
  public safeTransferFrom(
    from: EVMAccountAddress,
    to: EVMAccountAddress,
    tokenId: TokenId,
    amount: TokenAmount,
    data: string,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ERC1155ContractError
  > {
    return this.writeToContract(
      "safeTransferFrom",
      [from, to, tokenId, amount, data],
      overrides,
    );
  }

  public safeBatchTransferFrom(
    from: EVMAccountAddress,
    to: EVMAccountAddress,
    tokenIds: TokenId[],
    amounts: TokenAmount[],
    data: string,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ERC1155ContractError
  > {
    return this.writeToContract(
      "safeBatchTransferFrom",
      [from, to, tokenIds, amounts, data],
      overrides,
    );
  }

  // ===== End: Functions to support pre-mint NFTs =====

  public totalSupply(
    tokenId: TokenId,
  ): ResultAsync<bigint, ERC1155ContractError | BlockchainCommonErrors> {
    return ResultAsync.fromPromise(
      this.contract.totalSupply(tokenId) as Promise<bigint>,
      (e) => {
        return this.generateError(e, "Unable to call totalSupply()");
      },
    );
  }

  public exists(
    tokenId: TokenId,
  ): ResultAsync<boolean, ERC1155ContractError | BlockchainCommonErrors> {
    return ResultAsync.fromPromise(
      this.contract.exists(tokenId) as Promise<boolean>,
      (e) => {
        return this.generateError(e, "Unable to call exists()");
      },
    );
  }

  // Function to get the number of reward token types on the contract
  public rewardsTokenCount(): ResultAsync<
    bigint,
    ERC1155ContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.tokenCount() as Promise<bigint>,
      (e) => {
        return this.generateError(e, "Unable to call exists()");
      },
    );
  }

  // Function to create new token ids
  public createNewTokens(
    newURIs: TokenUri[],
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ERC1155ContractError
  > {
    return this.writeToContract("createNewTokens", [newURIs], overrides);
  }

  protected generateContractSpecificError(
    msg: string,
    e: IEthersContractError,
    transaction: ethers.Transaction | null,
  ): ERC1155ContractError {
    return new ERC1155ContractError(msg, e, transaction);
  }

  public filters = {
    TransferSingle: (
      operatorAddress: EVMAccountAddress | null,
      fromAddress: EVMAccountAddress | null,
      toAddress: EVMAccountAddress | null,
      tokenId: TokenId | null,
      value: bigint,
    ): ethers.DeferredTopicFilter => {
      return this.contract.filters.TransferSingle(
        operatorAddress,
        fromAddress,
        toAddress,
        tokenId,
        value,
      );
    },
  };
}
