import {
  EVMAccountAddress,
  IEVMBalance,
  IEVMNFT,
} from "@snickerdoodlelabs/objects";
import { JsonRpcEngine, JsonRpcError } from "json-rpc-engine";
import { ResultAsync } from "neverthrow";

import CoreHandler from "@app/coreGateways/handler/CoreHandler";
import { EInternalActions } from "@shared/enums";
import { IInternalState } from "@shared/interfaces/states";

export class InternalCoreGateway {
  protected _handler: CoreHandler;
  constructor(protected rpcEngine: JsonRpcEngine) {
    this._handler = new CoreHandler(rpcEngine);
  }

  public getState(): ResultAsync<IInternalState, JsonRpcError> {
    return this._handler.call(EInternalActions.GET_STATE);
  }
  public getAccounts(): ResultAsync<EVMAccountAddress[], JsonRpcError> {
    return this._handler.call(EInternalActions.GET_ACCOUNTS);
  }
  public getAccountBalances(): ResultAsync<IEVMBalance[], JsonRpcError> {
    return this._handler.call(EInternalActions.GET_ACCOUNT_BALANCES);
  }
  public getAccountNFTs(): ResultAsync<IEVMNFT[], JsonRpcError> {
    return this._handler.call(EInternalActions.GET_ACCOUNT_NFTS);
  }
}
