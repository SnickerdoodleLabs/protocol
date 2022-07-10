import { Subject } from "rxjs";

import {
  ILoginParams,
  IGetLoginMessageParams,
  IAddAccountParams,
} from "@shared/objects/EventParams";

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
