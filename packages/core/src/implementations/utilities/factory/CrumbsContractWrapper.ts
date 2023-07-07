import { ILogUtils } from "@snickerdoodlelabs/common-utils";
import {
  ContractOverrides,
  ICrumbsContract,
  WrappedTransactionResponse,
} from "@snickerdoodlelabs/contracts-sdk";
import {
  EVMContractAddress,
  TokenId,
  HexString,
  EVMAccountAddress,
  TokenUri,
  CrumbsContractError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { BaseContractWrapper } from "@core/implementations/utilities/factory/BaseContractWrapper.js";
import { IContextProvider } from "@core/interfaces/utilities/index.js";

/**
 * This wrapper implements some metrics utilities and well as reliability (by implementing fallbacks to a secondary provider)
 */
export class CrumbsContractWrapper
  extends BaseContractWrapper<ICrumbsContract>
  implements ICrumbsContract
{
  public constructor(
    primary: ICrumbsContract,
    secondary: ICrumbsContract | null,
    contextProvider: IContextProvider,
    logUtils: ILogUtils,
  ) {
    super(primary, secondary, contextProvider, logUtils);
  }

  public getContractAddress(): EVMContractAddress {
    return this.primary.getContractAddress();
  }

  public addressToCrumbId(
    accountAddress: EVMAccountAddress,
    contractOverrides?: ContractOverrides | undefined,
  ): ResultAsync<TokenId | null, CrumbsContractError> {
    return this.fallback(
      () => this.primary.addressToCrumbId(accountAddress, contractOverrides),
      () => this.secondary?.addressToCrumbId(accountAddress, contractOverrides),
    );
  }

  public tokenURI(
    tokenId: TokenId,
    contractOverrides?: ContractOverrides | undefined,
  ): ResultAsync<TokenUri | null, CrumbsContractError> {
    return this.fallback(
      () => this.primary.tokenURI(tokenId, contractOverrides),
      () => this.secondary?.tokenURI(tokenId, contractOverrides),
    );
  }

  public createCrumb(
    crumbId: TokenId,
    tokenUri: TokenUri,
    contractOverrides?: ContractOverrides | undefined,
  ): ResultAsync<WrappedTransactionResponse, CrumbsContractError> {
    return this.fallback(
      () => this.primary.createCrumb(crumbId, tokenUri, contractOverrides),
      () => this.secondary?.createCrumb(crumbId, tokenUri, contractOverrides),
    );
  }

  public encodeCreateCrumb(
    crumbId: TokenId,
    crumbContent: TokenUri,
  ): HexString {
    return this.primary.encodeCreateCrumb(crumbId, crumbContent);
  }

  public burnCrumb(
    crumbId: TokenId,
    contractOverrides?: ContractOverrides | undefined,
  ): ResultAsync<WrappedTransactionResponse, CrumbsContractError> {
    return this.fallback(
      () => this.primary.burnCrumb(crumbId, contractOverrides),
      () => this.secondary?.burnCrumb(crumbId, contractOverrides),
    );
  }

  public encodeBurnCrumb(crumbId: TokenId): HexString {
    return this.primary.encodeBurnCrumb(crumbId);
  }
}
