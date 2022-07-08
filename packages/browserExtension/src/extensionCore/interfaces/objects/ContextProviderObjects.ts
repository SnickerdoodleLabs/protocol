import { Subject } from "rxjs";

import {
  IUnlockParams,
  IGetUnlockMessageParams,
  IAddAccountParams,
} from "@shared/objects/EventParams";

export interface IResolvers {
  resolveError: (error: any) => void;
  resolveResult: (result?: any) => void;
}

export interface IUnlock {
  params: IUnlockParams;
  resolvers: IResolvers;
}

export interface IGetUnlockMessage {
  params: IGetUnlockMessageParams;
  resolvers: IResolvers;
}

export interface IAddAccount {
  params: IAddAccountParams;
  resolvers: IResolvers;
}

export class ClientEvents {
  constructor(
    public onUnlockRequest = new Subject<IUnlock>(),
    public onUnlockMessageRequest = new Subject<IGetUnlockMessage>(),
    public onAddAccountRequest = new Subject<IAddAccount>(),
  ) {}
}

export class UiContext {}
