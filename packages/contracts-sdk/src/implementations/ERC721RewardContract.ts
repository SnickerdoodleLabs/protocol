import { ContractsAbis } from "@contracts-sdk/interfaces/objects/abi";
import { RewardRoles } from "@contracts-sdk/interfaces/objects/RewardRoles.js";
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
import { ok, err, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IERC721RewardContract } from "..";

@injectable()
export class ERC721RewardContract implements IERC721RewardContract {
  protected contract: ethers.Contract;
  protected contractFactory: ethers.ContractFactory;
  constructor(
    protected providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
    public contractAddress: EVMContractAddress,
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

  // function to deploy a new ERC721 reward contract
  public deployNewReward(
    name: string,
    symbol: string,
    baseURI: BaseURI,
  ): ResultAsync<EVMContractAddress, ERC721RewardContractError> {
    return ResultAsync.fromPromise(
      this.contractFactory.deploy(symbol, name, {
        gasLimit: "5000000", //required to help overcome deployment gas estimation on ethers
      }),
      (e) => {
        return new ERC721RewardContractError(
          "Failed to deploy contract",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).andThen((contract) => {
      return ResultAsync.fromPromise(contract.deployTransaction.wait(), (e) => {
        return new ERC721RewardContractError(
          "Failed to wait() for contract deployment",
          (e as IBlockchainError).reason,
          e,
        );
      }).andThen((receipt) => {
        return ResultAsync.fromPromise(
          this.contract.setBaseURI(baseURI),
          (e) => {
            return new ERC721RewardContractError(
              "Failed to wait() for contract deployment",
              (e as IBlockchainError).reason,
              e,
            );
          },
        ).andThen(() => {
          return okAsync(EVMContractAddress(receipt.contractAddress));
        });
      });
    });
  }

  public getOwner(): ResultAsync<EVMAccountAddress, ERC721RewardContractError> {
    return ResultAsync.fromPromise(
      this.contract.getRoleMember(
        RewardRoles.DEFAULT_ADMIN_ROLE,
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
        RewardRoles.DEFAULT_ADMIN_ROLE,
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
              RewardRoles.DEFAULT_ADMIN_ROLE,
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
        RewardRoles.MINTER_ROLE,
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
              RewardRoles.MINTER_ROLE,
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
        return ok(null);
      }
      return err(error);
    });
  }

  public hasRole(
    role: keyof typeof RewardRoles,
    address: EVMAccountAddress,
  ): ResultAsync<boolean, ERC721RewardContractError> {
    return ResultAsync.fromPromise(
      this.contract.hasRole(RewardRoles[role], address) as Promise<boolean>,
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
    role: keyof typeof RewardRoles,
    address: EVMAccountAddress,
  ): ResultAsync<void, ERC721RewardContractError> {
    return ResultAsync.fromPromise(
      this.contract.grantRole(
        RewardRoles[role],
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
    role: keyof typeof RewardRoles,
    address: EVMAccountAddress,
  ): ResultAsync<void, ERC721RewardContractError> {
    return ResultAsync.fromPromise(
      this.contract.revokeRole(
        RewardRoles[role],
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
    role: keyof typeof RewardRoles,
    address: EVMAccountAddress,
  ): ResultAsync<void, ERC721RewardContractError> {
    return ResultAsync.fromPromise(
      this.contract.renounceRole(
        RewardRoles[role],
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
