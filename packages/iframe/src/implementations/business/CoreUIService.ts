import { ICoreUIService } from "@core-iframe/interfaces/business";
import { okAsync, ResultAsync } from "neverthrow";

export class CoreUIService implements ICoreUIService {
  protected authenticationContentId =
    "__hypernet-protocol-iframe-authentication-content__";
  protected failureContentId =
    "__hypernet-protocol-iframe-authentication-failuer-content__";
  constructor() {}

  public renderCeramicAuthenticationUI(): ResultAsync<void, never> {
    this._cleanUpAuthenticationContent();

    const content = document.createElement("div");
    content.id = this.authenticationContentId;
    content.innerHTML = `<h3>3ID Connect wants to authenticate: </h3>`;

    document.body.appendChild(content);
    return okAsync(undefined);
  }

  public renderCeramicFailureUI(): ResultAsync<void, never> {
    this._cleanUpAuthenticationContent();

    const content = document.createElement("div");
    content.id = this.failureContentId;
    content.innerHTML = `<h4>Something went wrong during with ceramic</h4>`;

    document.body.appendChild(content);
    return okAsync(undefined);
  }

  public renderCeramicAuthenticationSucceededUI(): ResultAsync<void, never> {
    this._cleanUpAuthenticationContent();
    return okAsync(undefined);
  }

  private _cleanUpAuthenticationContent() {
    const prevElm = document.getElementById(this.authenticationContentId);
    //remove if there is already a previous 3id connect related content
    if (prevElm) {
      prevElm.remove();
    }

    const prevFailureElm = document.getElementById(this.failureContentId);
    //remove if there is already a previous 3id connect related failure content
    if (prevFailureElm) {
      prevFailureElm.remove();
    }
  }
}
