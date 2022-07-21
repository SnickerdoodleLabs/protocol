import { IRpcCallHandler } from "@interfaces/api";
import { IAccountService } from "@interfaces/business";
import { IContextProvider } from "@interfaces/utilities";
import { EExternalActions, EInternalActions } from "@shared/enums";
import { DEFAULT_RPC_SUCCESS_RESULT } from "@shared/constants/rpcCall";
import {
  SnickerDoodleCoreError,
  ExtensionCookieError,
} from "@shared/objects/errors";
import {
  IUnlockParams,
  IGetUnlockMessageParams,
  IAddAccountParams,
} from "@shared/interfaces/actions";
import {
  EVMAccountAddress,
  LanguageCode,
  Signature,
} from "@snickerdoodlelabs/objects";
import {
  AsyncJsonRpcEngineNextCallback,
  JsonRpcRequest,
  PendingJsonRpcResponse,
} from "json-rpc-engine";

import { okAsync, ResultAsync } from "neverthrow";

export class RpcCallHandler implements IRpcCallHandler {
  constructor(
    protected contextProvider: IContextProvider,
    protected accountService: IAccountService,
  ) {}

  public async handleRpcCall(
    req: JsonRpcRequest<unknown>,
    res: PendingJsonRpcResponse<unknown>,
    next: AsyncJsonRpcEngineNextCallback,
  ) {
    const { method, params } = req;

    switch (method) {
      case EExternalActions.UNLOCK: {
        const { accountAddress, signature, languageCode } =
          params as IUnlockParams;
        return this._sendAsyncResponse(
          this.unlock(accountAddress, signature, languageCode),
          res,
        );
      }
      case EExternalActions.ADD_ACCOUNT: {
        const { accountAddress, signature, languageCode } =
          params as IAddAccountParams;
        return this._sendAsyncResponse(
          this.addAccount(accountAddress, signature, languageCode),
          res,
        );
      }
      case EExternalActions.GET_UNLOCK_MESSAGE: {
        const { languageCode } = params as IGetUnlockMessageParams;
        return this._sendAsyncResponse(
          this.getUnlockMessage(languageCode),
          res,
        );
      }
      case EExternalActions.GET_STATE:
        return (res.result = this.contextProvider.getExterenalState());

      case EInternalActions.GET_STATE:
        return (res.result = this.contextProvider.getInternalState());
      default:
        return next();
    }
  }

  private _sendAsyncResponse = async <T, K extends Error>(
    fn: ResultAsync<T, K>,
    res: PendingJsonRpcResponse<unknown>,
  ) => {
    await fn
      .mapErr((err) => {
        res.error = err;
      })
      .map((result) => {
        if (typeof result === typeof undefined) {
          res.result = DEFAULT_RPC_SUCCESS_RESULT;
        } else {
          res.result = result;
        }
        return okAsync(undefined);
      });
  };

  private unlock(
    account: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<void, SnickerDoodleCoreError | ExtensionCookieError> {
    return this.accountService.unlock(account, signature, languageCode);
  }
  private addAccount(
    account: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<void, SnickerDoodleCoreError | ExtensionCookieError> {
    return this.accountService.addAccount(account, signature, languageCode);
  }
  private getUnlockMessage(
    languageCode: LanguageCode,
  ): ResultAsync<string, SnickerDoodleCoreError> {
    return this.accountService.getUnlockMessage(languageCode);
  }
}
