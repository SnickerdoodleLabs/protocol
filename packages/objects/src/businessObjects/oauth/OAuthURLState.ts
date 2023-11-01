import { EOAuthProvider } from "@objects/enum/index.js";

export class OAuthURLState {
  constructor(
    public provider: EOAuthProvider,
    public redirectTabId: number | undefined = undefined,
  ) {}

  public getEncodedState(): string {
    return encodeURIComponent(
      JSON.stringify({
        provider: this.provider,
        redirectTabId: this.redirectTabId,
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
    const { provider, redirectTabId } = JSON.parse(decodeURIComponent(state));
    return new OAuthURLState(provider, redirectTabId);
  }
}
