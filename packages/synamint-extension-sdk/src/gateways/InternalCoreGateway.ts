import {
  EmailAddressString,
  FamilyName,
  GivenName,
  WalletNFT,
  TokenBalance,
  LinkedAccount,
  ProxyError,
  WalletNftWithHistory,
} from "@snickerdoodlelabs/objects";
import { JsonRpcEngine } from "json-rpc-engine";
import { ResultAsync } from "neverthrow";

import CoreHandler from "@synamint-extension-sdk/gateways/handler/CoreHandler";
import {
  GetAccountBalancesParams,
  GetAccountCachedNFTsParams,
  GetAccountsParams,
  GetConfigParams,
  GetEmailParams,
  GetFamilyNameParams,
  GetGivenNameParams,
  GetInternalStateParams,
  IInternalState,
  IsDataWalletAddressInitializedParams,
} from "@synamint-extension-sdk/shared";
import { IExtensionConfig } from "@synamint-extension-sdk/shared/interfaces/IExtensionConfig";

export class InternalCoreGateway {
  protected _handler: CoreHandler;
  constructor(protected rpcEngine: JsonRpcEngine) {
    this._handler = new CoreHandler(rpcEngine);
  }

  public updateRpcEngine(rpcEngine: JsonRpcEngine) {
    this._handler.updateRpcEngine(rpcEngine);
  }

  public getState(): ResultAsync<IInternalState, ProxyError> {
    return this._handler.call(new GetInternalStateParams());
  }
  public getAccounts(): ResultAsync<LinkedAccount[], ProxyError> {
    return this._handler.call(new GetAccountsParams());
  }
  public getAccountBalances(): ResultAsync<TokenBalance[], ProxyError> {
    return this._handler.call(new GetAccountBalancesParams());
  }
  public getAccountCachedNFTs(): ResultAsync<
    WalletNftWithHistory[],
    ProxyError
  > {
    return this._handler.call(new GetAccountCachedNFTsParams());
  }
  public isDataWalletAddressInitialized(): ResultAsync<boolean, ProxyError> {
    return this._handler.call(new IsDataWalletAddressInitializedParams());
  }
  public getFamilyName(): ResultAsync<FamilyName | null, ProxyError> {
    return this._handler.call(new GetFamilyNameParams());
  }
  public getGivenName(): ResultAsync<GivenName | null, ProxyError> {
    return this._handler.call(new GetGivenNameParams());
  }
  public getEmail(): ResultAsync<EmailAddressString | null, ProxyError> {
    return this._handler.call(new GetEmailParams());
  }
  public getConfig(): ResultAsync<IExtensionConfig, ProxyError> {
    return this._handler.call(new GetConfigParams());
  }
}
