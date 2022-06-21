import {
  EthereumAccountAddress,
  LanguageCode,
  Signature,
} from "@snickerdoodlelabs/objects";
import { Subject } from "rxjs";
import { Runtime } from "webextension-polyfill";

export class AccountContext {
  constructor(
    public account: EthereumAccountAddress | null,
    public initialized: boolean,
  ) {}
}

export class PortEvents {
  constructor(
    public onPortConnectionRequested: Subject<Runtime.Port>,
    public onPortConnectionRejected?: Subject<any>,
    public onPortConnectionEstablished?: Subject<any>,
    public onPortConnectionDetached?: Subject<any>,
  ) {}
}

export class ClientEvents {
  constructor(
    public onLoginRequest: Subject<{
      params: {
        accountAddress: EthereumAccountAddress;
        signature: Signature;
        languageCode: LanguageCode;
      };
      onError: (error: any) => void;
      onResult: (result: any) => void;
    }>,
    public onLoginMessageRequest: Subject<{
      params: { languageCode: LanguageCode };
      onError: (error: any) => void;
      onResult: (result: any) => void;
    }>,
    public addAccountRequest: Subject<{
      params: {
        accountAddress: EthereumAccountAddress;
        signature: Signature;
        languageCode: LanguageCode;
      };
      onError: (error: any) => void;
      onResult: (result: any) => void;
    }>,
  ) {}
}

export class UiContext {}
