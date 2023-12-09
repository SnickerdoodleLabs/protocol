import { EOAuthProvider, EOAuthRequestSource } from "@objects/enum/index.js";

export class OAuthURLState {
  constructor(
    public provider: EOAuthProvider,
    public redirectTabId: number | undefined = undefined,
    public requestSource: EOAuthRequestSource = EOAuthRequestSource.WEBSITE,
  ) {}

  public getEncodedState(): string {
    return encodeURIComponent(
      JSON.stringify({
        provider: this.provider,
        redirectTabId: this.redirectTabId,
        requestSource: this.requestSource,
      }),
    );
  }
  public overrideUrlWithState(url: string) {
    const urlObj = new URL(url);
    const state = urlObj.searchParams.get("state");
    if (state) {
      const stateObj = JSON.parse(decodeURIComponent(state));
      const overridedStateObj = {
        ...stateObj,
        provider: this.provider,
        redirectTabId: this.redirectTabId,
        requestSource: this.requestSource,
      };
      urlObj.searchParams.set(
        "state",
        encodeURIComponent(JSON.stringify(overridedStateObj)),
      );
      urlObj.searchParams.set("state", this.getEncodedState());
    } else {
      urlObj.searchParams.set("state", this.getEncodedState());
    }
    return urlObj.toString();
  }

  static getParsedState(state: string): OAuthURLState {
    const { provider, redirectTabId, requestSource } = JSON.parse(
      decodeURIComponent(state),
    );
    return new OAuthURLState(provider, redirectTabId, requestSource);
  }
}
