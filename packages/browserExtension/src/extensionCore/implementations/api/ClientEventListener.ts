import { IClientEventListener } from "@interfaces/api/IClientEventListener";
import { IContextProvider } from "@interfaces/utilities";
import {
  EthereumAccountAddress,
  LanguageCode,
  Signature,
} from "@snickerdoodlelabs/objects";

export class ClientEventsListener implements IClientEventListener {
  constructor(protected contextProvider: IContextProvider) {
    this.contextProvider.getClientEvents().map((clientEvents) => {
      clientEvents.onLoginRequest.subscribe(this.onLoginRequest.bind(this));
    });
  }
  public onLoginRequest(param: {
    params: {
      accountAddress: EthereumAccountAddress;
      signature: Signature;
      languageCode: LanguageCode;
    };
    onError: (error: any) => void;
    onResult: (result: any) => void;
  }) {
    console.log("requested getted with params", param);
    param.onResult("fake result");
  }
}

interface a {
  a: string
}

interface b {
  b: string
}
