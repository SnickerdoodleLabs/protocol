import { BaseContractWrapper } from "@core/implementations/utilities/factory/BaseContractWrapper.js";
import { IContextProvider } from "@core/interfaces/utilities/index.js";
import { ILogUtils } from "@snickerdoodlelabs/common-utils";
import {
  ISiftContract,
  WrappedTransactionResponse,
} from "@snickerdoodlelabs/contracts-sdk";
import {
  EVMContractAddress,
  SiftContractError,
  BaseURI,
  DomainName,
  TokenUri,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

/**
 * This wrapper implements some metrics utilities and well as reliability (by implementing fallbacks to a secondary provider)
 */
export class SiftContractWrapper
  extends BaseContractWrapper<ISiftContract>
  implements ISiftContract
{
  public constructor(
    primary: ISiftContract,
    secondary: ISiftContract | null,
    contextProvider: IContextProvider,
    logUtils: ILogUtils,
  ) {
    super(primary, secondary, contextProvider, logUtils);
  }

  public getContractAddress(): EVMContractAddress {
    return this.primary.getContractAddress();
  }

  public verifyURL(
    domain: DomainName,
  ): ResultAsync<WrappedTransactionResponse, SiftContractError> {
    return this.fallback(
      () => this.primary.verifyURL(domain),
      () => this.secondary?.verifyURL(domain),
    );
  }

  public maliciousURL(
    domain: DomainName,
  ): ResultAsync<WrappedTransactionResponse, SiftContractError> {
    return this.fallback(
      () => this.primary.maliciousURL(domain),
      () => this.secondary?.maliciousURL(domain),
    );
  }

  public checkURL(
    domain: DomainName,
  ): ResultAsync<TokenUri, SiftContractError> {
    return this.fallback(
      () => this.primary.checkURL(domain),
      () => this.secondary?.checkURL(domain),
    );
  }

  public setBaseURI(
    baseUri: BaseURI,
  ): ResultAsync<WrappedTransactionResponse, SiftContractError> {
    return this.fallback(
      () => this.primary.setBaseURI(baseUri),
      () => this.secondary?.setBaseURI(baseUri),
    );
  }
}
