import {
  EthereumAccountAddress,
} from "@snickerdoodlelabs/objects";
import { Subject } from "rxjs";
import { Runtime } from "webextension-polyfill";
import {
  ILoginParams,
  IGetLoginMessageParams,
  IAddAccountParams,
} from "@shared/objects/EventParams";

export class AccountContext {
  constructor(
    public account: EthereumAccountAddress | null,
    public initialized: boolean,
  ) {}
}

// TODO remove unused
export class PortEvents {
  constructor(
    public onPortConnectionRequested: Subject<Runtime.Port>,
    public onPortConnectionRejected?: Subject<any>,
    public onPortConnectionEstablished?: Subject<any>,
    public onPortConnectionDetached?: Subject<any>,
  ) {}
}

export interface IResolvers {
  resolveError: (error: any) => void;
  resolveResult: (result: any) => void;
}

export interface ILogin {
  params: ILoginParams;
  resolvers: IResolvers;
}

export interface IGetLoginMessage {
  params: IGetLoginMessageParams;
  resolvers: IResolvers;
}

export interface IAddAccount {
  params: IAddAccountParams;
  resolvers: IResolvers;
}

export class ClientEvents {
  constructor(
    public onLoginRequest = new Subject<ILogin>(),
    public onLoginMessageRequest = new Subject<IGetLoginMessage>(),
    public onAddAccountRequest = new Subject<IAddAccount>(),
  ) {}
}

export class UiContext {}
