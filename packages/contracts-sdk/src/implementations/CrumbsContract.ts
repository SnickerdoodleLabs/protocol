import { BaseContract } from "@contracts-sdk/implementations/BaseContract.js";
import { ICrumbsContract } from "@contracts-sdk/interfaces/ICrumbsContract.js";
import {
  ContractsAbis,
  WrappedTransactionResponse,
  ContractOverrides,
} from "@contracts-sdk/interfaces/objects/index.js";
import {
  EVMAccountAddress,
  EVMContractAddress,
  TokenUri,
  TokenId,
  CrumbsContractError,
  HexString,
  TBlockchainCommonErrors,
  BlockchainErrorMapper,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { okAsync, errAsync, ResultAsync } from "neverthrow";

@injectable()
export class CrumbsContract
  extends BaseContract<CrumbsContractError>
  implements ICrumbsContract
{
  constructor(
    protected providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
    protected contractAddress: EVMContractAddress,
  ) {
    super(providerOrSigner, contractAddress, ContractsAbis.CrumbsAbi.abi);
  }

  public getContractAddress(): EVMContractAddress {
    return this.contractAddress;
  }

  public addressToCrumbId(
    accountAddress: EVMAccountAddress,
  ): ResultAsync<
    TokenId | null,
    CrumbsContractError | TBlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.addressToCrumbId(accountAddress) as Promise<TokenId>,
      (e) => {
        return this.generateError(e, "Unable to call addressToCrumbId()");
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
  ): ResultAsync<
    TokenUri | null,
    CrumbsContractError | TBlockchainCommonErrors
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
        return okAsync(null);
      }
      return errAsync(error);
    });
  }

  public createCrumb(
    crumbId: TokenId,
    tokenUri: TokenUri,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    TBlockchainCommonErrors | CrumbsContractError
  > {
    return this.writeToContract("createCrumb", [crumbId, tokenUri], overrides);
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
    overrides?: ContractOverrides | undefined,
  ): ResultAsync<
    WrappedTransactionResponse,
    TBlockchainCommonErrors | CrumbsContractError
  > {
    return this.writeToContract("createCrumb", [crumbId], overrides);
  }

  public encodeBurnCrumb(crumbId: TokenId): HexString {
    return HexString(
      this.contract.interface.encodeFunctionData("burnCrumb", [crumbId]),
    );
  }

  public updateTokenURI(
    crumbId: TokenId,
    tokenURI: TokenUri,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    TBlockchainCommonErrors | CrumbsContractError
  > {
    return this.writeToContract(
      "updateTokenURI",
      [crumbId, tokenURI],
      overrides,
    );
  }

  protected generateContractSpecificError(
    msg: string,
    reason: string | undefined,
    e: unknown,
  ): CrumbsContractError {
    return new CrumbsContractError(msg, reason, e);
  }

  protected generateError(
    error,
    errorMessage: string,
  ): CrumbsContractError | TBlockchainCommonErrors {
    return BlockchainErrorMapper.buildBlockchainError(
      error,
      (msg, reason, err) =>
        this.generateContractSpecificError(errorMessage || msg, reason, err),
    );
  }
}
