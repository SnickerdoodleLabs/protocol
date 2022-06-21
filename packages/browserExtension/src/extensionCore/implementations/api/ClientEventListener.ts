import { IClientEventListener } from "@interfaces/api/IClientEventListener";
import { IContextProvider } from "@interfaces/utilities";
import {
  EthereumAccountAddress,
  LanguageCode,
  Signature,
} from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";

export class ClientEventsListener implements IClientEventListener {
  constructor(protected contextProvider: IContextProvider) {}

  public initialize(): ResultAsync<void, never> {
    this.contextProvider.getClientEvents().map((clientEvents) => {
      clientEvents.onLoginRequest.subscribe(this.onLoginRequest.bind(this));
    });
    return okAsync(undefined);
  }

  private onLoginRequest(param: {
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
