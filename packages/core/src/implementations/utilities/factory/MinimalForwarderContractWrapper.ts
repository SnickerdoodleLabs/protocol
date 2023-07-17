import { BaseContractWrapper } from "@core/implementations/utilities/factory/BaseContractWrapper.js";
import { IContextProvider } from "@core/interfaces/utilities/index.js";
import { ILogUtils } from "@snickerdoodlelabs/common-utils";
import {
  IMinimalForwarderContract,
  IMinimalForwarderRequest,
  WrappedTransactionResponse,
} from "@snickerdoodlelabs/contracts-sdk";
import {
  EVMContractAddress,
  EVMAccountAddress,
  MinimalForwarderContractError,
  BigNumberString,
  Signature,
  TBlockchainCommonErrors,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

/**
 * This wrapper implements some metrics utilities and well as reliability (by implementing fallbacks to a secondary provider)
 */
export class MinimalForwarderContractWrapper
  extends BaseContractWrapper<IMinimalForwarderContract>
  implements IMinimalForwarderContract
{
  public constructor(
    primary: IMinimalForwarderContract,
    secondary: IMinimalForwarderContract | null,
    contextProvider: IContextProvider,
    logUtils: ILogUtils,
  ) {
    super(primary, secondary, contextProvider, logUtils);
  }
  public getNonce(
    from: EVMAccountAddress,
  ): ResultAsync<
    BigNumberString,
    MinimalForwarderContractError | TBlockchainCommonErrors
  > {
    return this.fallback(
      () => this.primary.getNonce(from),
      () => this.secondary?.getNonce(from),
    );
  }
  public verify(
    request: IMinimalForwarderRequest,
    signature: Signature,
  ): ResultAsync<
    boolean,
    MinimalForwarderContractError | TBlockchainCommonErrors
  > {
    return this.fallback(
      () => this.primary.verify(request, signature),
      () => this.secondary?.verify(request, signature),
    );
  }
  public execute(
    request: IMinimalForwarderRequest,
    signature: Signature,
  ): ResultAsync<
    WrappedTransactionResponse,
    TBlockchainCommonErrors | MinimalForwarderContractError
  > {
    return this.fallback(
      () => this.primary.execute(request, signature),
      () => this.secondary?.execute(request, signature),
    );
  }

  public getContractAddress(): EVMContractAddress {
    return this.primary.getContractAddress();
  }
}
