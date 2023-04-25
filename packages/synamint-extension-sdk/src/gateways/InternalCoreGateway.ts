import {
  EmailAddressString,
  FamilyName,
  GivenName,
  WalletNFT,
  TokenBalance,
  LinkedAccount,
} from "@snickerdoodlelabs/objects";
import { JsonRpcEngine, JsonRpcError } from "json-rpc-engine";
import { ResultAsync } from "neverthrow";

import CoreHandler from "@synamint-extension-sdk/gateways/handler/CoreHandler";
import {
  GetAccountBalancesParams,
  GetAccountNFTsParams,
  GetAccountsParams,
  GetEmailParams,
  GetFamilyNameParams,
  GetGivenNameParams,
  GetInternalStateParams,
  IInternalState,
  IsDataWalletAddressInitializedParams,
} from "@synamint-extension-sdk/shared";

export class InternalCoreGateway {
  protected _handler: CoreHandler;
  constructor(protected rpcEngine: JsonRpcEngine) {
    this._handler = new CoreHandler(rpcEngine);
  }

  public updateRpcEngine(rpcEngine: JsonRpcEngine) {
    this._handler.updateRpcEngine(rpcEngine);
  }

  public getState(): ResultAsync<IInternalState, JsonRpcError> {
    return this._handler.call(new GetInternalStateParams());
  }
  public getAccounts(): ResultAsync<LinkedAccount[], JsonRpcError> {
    return this._handler.call(new GetAccountsParams());
  }
  public getAccountBalances(): ResultAsync<TokenBalance[], JsonRpcError> {
    return this._handler.call(new GetAccountBalancesParams());
  }
  public getAccountNFTs(): ResultAsync<WalletNFT[], JsonRpcError> {
    return this._handler.call(new GetAccountNFTsParams());
  }
  public isDataWalletAddressInitialized(): ResultAsync<boolean, JsonRpcError> {
    return this._handler.call(new IsDataWalletAddressInitializedParams());
  }
  public getFamilyName(): ResultAsync<FamilyName | null, JsonRpcError> {
    return this._handler.call(new GetFamilyNameParams());
  }
  public getGivenName(): ResultAsync<GivenName | null, JsonRpcError> {
    return this._handler.call(new GetGivenNameParams());
  }
  public getEmail(): ResultAsync<EmailAddressString | null, JsonRpcError> {
    return this._handler.call(new GetEmailParams());
  }
}
