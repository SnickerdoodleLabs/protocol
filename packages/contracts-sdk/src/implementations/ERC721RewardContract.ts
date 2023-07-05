import {
  EVMAccountAddress,
  EVMContractAddress,
  TokenUri,
  TokenId,
  IBlockchainError,
  BaseURI,
  ERC721RewardContractError,
} from "@snickerdoodlelabs/objects";
import { BigNumber, ethers, EventFilter } from "ethers";
import { injectable } from "inversify";
import { ResultAsync, okAsync, errAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { ERewardRoles } from "@contracts-sdk/interfaces/enums/index.js";
import { IERC721RewardContract } from "@contracts-sdk/interfaces/index.js";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/abi/index.js";

@injectable()
export class ERC721RewardContract implements IERC721RewardContract {
  protected contract: ethers.Contract;
  protected contractFactory: ethers.ContractFactory;
  constructor(
    protected providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
    protected contractAddress: EVMContractAddress,
  ) {
    this.contract = new ethers.Contract(
      contractAddress,
      ContractsAbis.ERC721Reward.abi,
      providerOrSigner,
    );
    this.contractFactory = new ethers.ContractFactory(
      ContractsAbis.ERC721Reward.abi,
      ContractsAbis.ERC721Reward.bytecode,
      providerOrSigner as ethers.Wallet,
    );
  }

  public getContractAddress(): EVMContractAddress {
    return this.contractAddress;
  }

  public getOwner(): ResultAsync<EVMAccountAddress, ERC721RewardContractError> {
    return ResultAsync.fromPromise(
      this.contract.getRoleMember(
        ERewardRoles.DEFAULT_ADMIN_ROLE,
        0,
      ) as Promise<EVMAccountAddress>,
      (e) => {
        return new ERC721RewardContractError(
          "Unable to call getRoleMember()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    );
  }

  // Returns an array of address that has the DEFAULT_ADMIN_ROLE on the Reward contract
  // Note that the address on index 0 is the contract owner
  public getDefaultAdminRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ERC721RewardContractError
  > {
    return ResultAsync.fromPromise(
      this.contract.getRoleMemberCount(
        ERewardRoles.DEFAULT_ADMIN_ROLE,
      ) as Promise<BigNumber>,
      (e) => {
        return new ERC721RewardContractError(
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
              ERewardRoles.DEFAULT_ADMIN_ROLE,
              index,
            ) as Promise<EVMAccountAddress>,
            (e) => {
              return new ERC721RewardContractError(
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

  public getMinterRoleMembers(): ResultAsync<
    EVMAccountAddress[],
    ERC721RewardContractError
  > {
    return ResultAsync.fromPromise(
      this.contract.getRoleMemberCount(
        ERewardRoles.MINTER_ROLE,
      ) as Promise<BigNumber>,
      (e) => {
        return new ERC721RewardContractError(
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
              ERewardRoles.MINTER_ROLE,
              index,
            ) as Promise<EVMAccountAddress>,
            (e) => {
              return new ERC721RewardContractError(
                "Unable to call getRoleMember() for MINTER_ROLE",
                (e as IBlockchainError).reason,
                e,
              );
            },
          );
        }),
      );
    });
  }

  public baseURI(): ResultAsync<BaseURI, ERC721RewardContractError> {
    return ResultAsync.fromPromise(
      this.contract.baseURI() as Promise<BaseURI>,
      (e) => {
        return new ERC721RewardContractError(
          "Unable to call baseURI()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    );
  }

  public setBaseURI(
    baseUri: BaseURI,
  ): ResultAsync<void, ERC721RewardContractError> {
    return ResultAsync.fromPromise(
      this.contract.setBaseURI(
        baseUri,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ERC721RewardContractError(
          "Unable to call setBaseURI()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new ERC721RewardContractError(
            "Wait for setBaseURI() failed",
            "Unknown",
            e,
          );
        });
      })
      .map(() => {});
  }

  public balanceOf(
    address: EVMAccountAddress,
  ): ResultAsync<number, ERC721RewardContractError> {
    return ResultAsync.fromPromise(
      this.contract.balanceOf(address) as Promise<BigNumber>,
      (e) => {
        return new ERC721RewardContractError(
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
  ): ResultAsync<EVMAccountAddress, ERC721RewardContractError> {
    return ResultAsync.fromPromise(
      this.contract.ownerOf(tokenId) as Promise<EVMAccountAddress>,
      (e) => {
        return new ERC721RewardContractError(
          "Unable to call ownerOf()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    );
  }

  public tokenURI(
    tokenId: TokenId,
  ): ResultAsync<TokenUri | null, ERC721RewardContractError> {
    return ResultAsync.fromPromise(
      this.contract.tokenURI(tokenId) as Promise<TokenUri | null>,
      (e) => {
        return new ERC721RewardContractError(
          "Unable to call tokenURI()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).orElse((error) => {
      // The contract reverts with this message if tokenId does not exist
      if (error.reason === "ERC721: operator query for nonexistent token") {
        return okAsync(null);
      }
      return errAsync(error);
    });
  }

  public hasRole(
    role: keyof typeof ERewardRoles,
    address: EVMAccountAddress,
  ): ResultAsync<boolean, ERC721RewardContractError> {
    return ResultAsync.fromPromise(
      this.contract.hasRole(ERewardRoles[role], address) as Promise<boolean>,
      (e) => {
        return new ERC721RewardContractError(
          "Unable to call hasRole()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    );
  }

  public grantRole(
    role: keyof typeof ERewardRoles,
    address: EVMAccountAddress,
  ): ResultAsync<void, ERC721RewardContractError> {
    return ResultAsync.fromPromise(
      this.contract.grantRole(
        ERewardRoles[role],
        address,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ERC721RewardContractError(
          "Unable to call grantRole()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new ERC721RewardContractError(
            "Wait for grantRole() failed",
            "Unknown",
            e,
          );
        });
      })
      .map(() => {});
  }

  public revokeRole(
    role: keyof typeof ERewardRoles,
    address: EVMAccountAddress,
  ): ResultAsync<void, ERC721RewardContractError> {
    return ResultAsync.fromPromise(
      this.contract.revokeRole(
        ERewardRoles[role],
        address,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ERC721RewardContractError(
          "Unable to call revokeRole()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new ERC721RewardContractError(
            "Wait for revokeRole() failed",
            "Unknown",
            e,
          );
        });
      })
      .map(() => {});
  }

  public renounceRole(
    role: keyof typeof ERewardRoles,
    address: EVMAccountAddress,
  ): ResultAsync<void, ERC721RewardContractError> {
    return ResultAsync.fromPromise(
      this.contract.renounceRole(
        ERewardRoles[role],
        address,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ERC721RewardContractError(
          "Unable to call renounceRole()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new ERC721RewardContractError(
            "Wait for renounceRole() failed",
            "Unknown",
            e,
          );
        });
      })
      .map(() => {});
  }

  public filters = {
    Transfer: (
      fromAddress: EVMAccountAddress | null,
      toAddress: EVMAccountAddress | null,
    ): EventFilter => {
      return this.contract.filters.Transfer(fromAddress, toAddress);
    },
  };

  public getContract(): ethers.Contract {
    return this.contract;
  }
}
