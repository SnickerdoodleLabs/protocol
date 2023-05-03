import { WrappedTransactionResponseBuilder } from "@contracts-sdk/implementations/WrappedTransactionResponseBuilder";
import { ICrumbsContract } from "@contracts-sdk/interfaces/ICrumbsContract";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/abi";
import { ContractOverrides } from "@contracts-sdk/interfaces/objects/ContractOverrides";
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

import { WrappedTransactionResponse } from "..";

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
  ): ResultAsync<WrappedTransactionResponse, CrumbsContractError> {
    if (contractOverrides) {
      return this.writeToContract("createCrumb", [
        crumbId,
        tokenUri,
        contractOverrides,
      ]);
    } else {
      return this.writeToContract("createCrumb", [crumbId, tokenUri]);
    }
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
  ): ResultAsync<WrappedTransactionResponse, CrumbsContractError> {
    if (contractOverrides) {
      return this.writeToContract("createCrumb", [crumbId, contractOverrides]);
    } else {
      return this.writeToContract("createCrumb", [crumbId]);
    }
  }

  public encodeBurnCrumb(crumbId: TokenId): HexString {
    return HexString(
      this.contract.interface.encodeFunctionData("burnCrumb", [crumbId]),
    );
  }

  public updateTokenURI(
    crumbId: TokenId,
    tokenURI: TokenUri,
  ): ResultAsync<WrappedTransactionResponse, CrumbsContractError> {
    return this.writeToContract("updateTokenURI", [crumbId, tokenURI]);
  }

  public getContract(): ethers.Contract {
    return this.contract;
  }

  // Takes the Crumbs contract's function name and params, submits the transaction and returns a WrappedTransactionResponse
  protected writeToContract(
    functionName: string,
    functionParams: any[],
    
  ): ResultAsync<WrappedTransactionResponse, CrumbsContractError> {
    return ResultAsync.fromPromise(
      this.contract[functionName](
        ...functionParams,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new CrumbsContractError(
          `Unable to call ${functionName}()`,
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map((tx) => {
      return this.toWrappedTransactionResponse(
        tx,
        functionName,
        functionParams,
      );
    });
  }

  protected toWrappedTransactionResponse(
    transactionResponse: ethers.providers.TransactionResponse,
    functionName: string,
    functionParams: any[],
  ): WrappedTransactionResponse {
    return WrappedTransactionResponseBuilder.buildWrappedTransactionResponse(
      transactionResponse,
      EVMContractAddress(this.contract.address),
      EVMAccountAddress((this.providerOrSigner as ethers.Wallet)?.address),
      functionName,
      functionParams,
      ContractsAbis.ConsentFactoryAbi.abi,
    );
  }
}
