import { WrappedTransactionResponseBuilder } from "@contracts-sdk/implementations/WrappedTransactionResponseBuilder";
import { ERewardRoles } from "@contracts-sdk/interfaces/enums/ERewardRoles.js";
import {
  ContractOverrides,
  IERC721RewardContract,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/index.js";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/abi";
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
import { WrapElementHandle } from "puppeteer";

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
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, ERC721RewardContractError> {
    return this.writeToContract("setBaseURI", [baseUri, overrides]);
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
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, ERC721RewardContractError> {
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
  ): ResultAsync<WrappedTransactionResponse, ERC721RewardContractError> {
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
  ): ResultAsync<WrappedTransactionResponse, ERC721RewardContractError> {
    return this.writeToContract(
      "renounceRole",
      [ERewardRoles[role], address],
      overrides,
    );
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

  // Takes the ERC721 Reward contract's function name and params, submits the transaction and returns a WrappedTransactionResponse
  protected writeToContract(
    functionName: string,
    functionParams: any[],
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, ERC721RewardContractError> {
    return ResultAsync.fromPromise(
      this.contract[functionName](...functionParams, {
        ...overrides,
      }) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ERC721RewardContractError(
          `Unable to call ${functionName}()`,
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map((transactionResponse) => {
      return WrappedTransactionResponseBuilder.buildWrappedTransactionResponse(
        transactionResponse,
        EVMContractAddress(this.contract.address),
        EVMAccountAddress((this.providerOrSigner as ethers.Wallet)?.address),
        functionName,
        functionParams,
        ContractsAbis.ConsentFactoryAbi.abi,
      );
    });
  }
}
