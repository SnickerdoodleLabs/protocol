import { ResultAsync } from "neverthrow";

export interface ICoreUIService {
  renderCeramicAuthenticationUI(): ResultAsync<void, never>;
  renderCeramicFailureUI(): ResultAsync<void, never>;
  renderCeramicAuthenticationSucceededUI(): ResultAsync<void, never>;
}

export const ICoreUIServiceType = Symbol.for("ICoreUIService");
