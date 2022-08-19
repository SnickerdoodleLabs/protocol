import {
  EVMAccountAddress,
  EVMContractAddress,
  TokenUri,
  TokenId,
  CrumbsContractError,
  IBlockchainError,
  HexString,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { ok, err, okAsync, ResultAsync } from "neverthrow";

import { ICrumbsContract } from "@contracts-sdk/interfaces/ICrumbsContract";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/abi";
import { ContractOverrides } from "@contracts-sdk/interfaces/objects/ContractOverrides";

@injectable()
export class CrumbsContract implements ICrumbsContract {
  protected contract: ethers.Contract;
  constructor(
    protected providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
    public contractAddress: EVMContractAddress,
  ) {
    this.contract = new ethers.Contract(
      contractAddress,
      ContractsAbis.CrumbsAbi.abi,
      providerOrSigner,
    );
  }

  public addressToCrumbId(
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenId | null, CrumbsContractError> {
    return ResultAsync.fromPromise(
      this.contract.addressToCrumbId(accountAddress) as Promise<TokenId>,
      (e) => {
        return new CrumbsContractError(
          "Unable to call addressToCrumbId()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map((tokenId) => {
      // The contract returns 0 for an address that does not have a Crumb Id
      // Handle by returning null
      if (tokenId == BigInt(0)) {
        return null;
      }
      return tokenId;
    });
  }

  public tokenURI(
    tokenId: TokenId,
  ): ResultAsync<TokenUri | null, CrumbsContractError> {
    return ResultAsync.fromPromise(
      this.contract.tokenURI(tokenId) as Promise<TokenUri | null>,
      (e) => {
        return new CrumbsContractError(
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

  public createCrumb(
    crumbId: TokenId,
    tokenUri: TokenUri,
    contractOverrides?: ContractOverrides,
  ): ResultAsync<void, CrumbsContractError> {
    return ResultAsync.fromPromise(
      this.contract.createCrumb(
        crumbId,
        tokenUri,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        // No error handling needed, any reverts from function call should return the reason
        return new CrumbsContractError(
          "Unable to call createCrumb()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new CrumbsContractError(
            "Wait for createCrumb() failed",
            "Unknown",
            e,
          );
        });
      })
      .map(() => {});
  }

  public encodeCreateCrumb(
    crumbId: TokenId,
    crumbContent: TokenUri,
  ): HexString {
    return HexString(
      this.contract.interface.encodeFunctionData("createCrumb", [
        crumbId,
        crumbContent,
      ]),
    );
  }

  public burnCrumb(
    crumbId: TokenId,
    contractOverrides?: ContractOverrides | undefined,
  ): ResultAsync<void, CrumbsContractError> {
    return ResultAsync.fromPromise(
      this.contract.burnCrumb(
        crumbId,
        contractOverrides,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        // No error handling needed, any reverts from function call should return the reason
        return new CrumbsContractError(
          "Unable to call burnCrumb()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new CrumbsContractError(
            "Wait for burnCrumb() failed",
            "Unknown",
            e,
          );
        });
      })
      .map(() => {});
  }

  public updateTokenURI(
    crumbId: TokenId,
    tokenURI: TokenUri,
  ): ResultAsync<void, CrumbsContractError> {
    return ResultAsync.fromPromise(
      this.contract.updateCrumb(
        crumbId,
        tokenURI,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        // No error handling needed, any reverts from function call should return the reason
        return new CrumbsContractError(
          "Unable to call updateCrumbId()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new CrumbsContractError(
            "Wait for updateCrumbId() failed",
            "Unknown",
            e,
          );
        });
      })
      .map(() => {});
  }

  public getContract(): ethers.Contract {
    return this.contract;
  }
}
