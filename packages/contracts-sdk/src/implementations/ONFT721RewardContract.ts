import {
  EVMAccountAddress,
  EVMContractAddress,
  TokenUri,
  TokenId,
  BaseURI,
  ONFT721RewardContractError,
  BlockchainCommonErrors,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync, okAsync, errAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IEthersContractError } from "@contracts-sdk/implementations/BlockchainErrorMapper.js";
import { ERC7529Contract } from "@contracts-sdk/implementations/ERC7529Contract.js";
import { ERewardRoles } from "@contracts-sdk/interfaces/enums/ERewardRoles.js";
import {
  ContractOverrides,
  IONFT721RewardContract,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/index.js";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/index.js";

@injectable()
export class ONFT721RewardContract
  extends ERC7529Contract<ONFT721RewardContractError>
  implements IONFT721RewardContract
{
  constructor(
    protected providerOrSigner: ethers.Provider | ethers.Signer,
    protected contractAddress: EVMContractAddress,
  ) {
    super(providerOrSigner, contractAddress, ContractsAbis.ONFT721Reward.abi);
  }

  public getContractAddress(): EVMContractAddress {
    return this.contractAddress;
  }

  public getOwner(): ResultAsync<
    EVMAccountAddress,
    ONFT721RewardContractError | BlockchainCommonErrors
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
    ONFT721RewardContractError | BlockchainCommonErrors
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
    ONFT721RewardContractError | BlockchainCommonErrors
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

  public baseURI(): ResultAsync<
    BaseURI,
    ONFT721RewardContractError | BlockchainCommonErrors
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
    BlockchainCommonErrors | ONFT721RewardContractError
  > {
    return this.writeToContract("setBaseURI", [baseUri, overrides]);
  }

  public balanceOf(
    address: EVMAccountAddress,
  ): ResultAsync<number, ONFT721RewardContractError | BlockchainCommonErrors> {
    return ResultAsync.fromPromise(
      this.contract.balanceOf(address) as Promise<bigint>,
      (e) => {
        return this.generateError(e, "Unable to call balanceOf()");
      },
    ).map((numberOfTokens) => {
      // TODO: Not sure if we can always be sure that numberOfTokens is a valid number, but seems reasonable
      return Number(numberOfTokens);
    });
  }

  // NOTE: If a given token id does not exist, the read transaction will revert.
  public ownerOf(
    tokenId: TokenId,
  ): ResultAsync<
    EVMAccountAddress,
    ONFT721RewardContractError | BlockchainCommonErrors
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
    ONFT721RewardContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.tokenURI(tokenId) as Promise<TokenUri | null>,
      (e) => {
        return this.generateError(e, "Unable to call tokenURI()");
      },
    ).orElse((error) => {
      // The contract reverts with this message if tokenId does not exist
      if (
        (error as any).reason ===
        "ONFT721: operator query for nonexistent token"
      ) {
        return okAsync(null);
      }
      return errAsync(error);
    });
  }

  public hasRole(
    role: keyof typeof ERewardRoles,
    address: EVMAccountAddress,
  ): ResultAsync<boolean, ONFT721RewardContractError | BlockchainCommonErrors> {
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
    BlockchainCommonErrors | ONFT721RewardContractError
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
    BlockchainCommonErrors | ONFT721RewardContractError
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
    BlockchainCommonErrors | ONFT721RewardContractError
  > {
    return this.writeToContract(
      "renounceRole",
      [ERewardRoles[role], address],
      overrides,
    );
  }

  // ===== Start: Functions to support testing pre-mint NFTs =====

  // ERC1155 contracts also have the same setApproveForAll function
  public isApprovedForAll(
    tokenOwnerAddress: EVMAccountAddress,
    operatorToApprove: EVMAccountAddress,
  ): ResultAsync<boolean, ONFT721RewardContractError | BlockchainCommonErrors> {
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
    addressToApprove: EVMAccountAddress,
    approved: boolean,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ONFT721RewardContractError
  > {
    return this.writeToContract(
      "setApproveForAll",
      [addressToApprove, approved],
      overrides,
    );
  }

  // Function that the escrow wallet will call to transfer NFTs from ONFT721 rewards after they are approved
  // Note: Unlike setApproveForAll, ONFT721's ABI for safeTransferFrom only supports ONFT721 as ERC1155's safeTransferFrom function takes additional parameters, refer to:
  // ERC721 : https://docs.openzeppelin.com/contracts/5.x/api/token/erc721#IERC721-safeTransferFrom-address-address-uint256-
  // ERC1155 : https://docs.openzeppelin.com/contracts/5.x/api/token/erc1155#IERC1155-safeTransferFrom-address-address-uint256-uint256-bytes-
  public safeTransferFrom(
    from: EVMAccountAddress,
    to: EVMAccountAddress,
    tokenId: TokenId,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ONFT721RewardContractError
  > {
    return this.writeToContract(
      "safeTransferFrom",
      [from, to, tokenId],
      overrides,
    );
  }

  // ===== End: Functions to support pre-mint NFTs =====

  // TODO: Add Layer Zero cross chain functions when needed.

  protected generateContractSpecificError(
    msg: string,
    e: IEthersContractError,
    transaction: ethers.Transaction | null,
  ): ONFT721RewardContractError {
    return new ONFT721RewardContractError(msg, e, transaction);
  }

  public filters = {
    Transfer: (
      fromAddress: EVMAccountAddress | null,
      toAddress: EVMAccountAddress | null,
    ): ethers.DeferredTopicFilter => {
      return this.contract.filters.Transfer(fromAddress, toAddress);
    },
  };
}
