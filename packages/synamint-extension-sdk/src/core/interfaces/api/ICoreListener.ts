import { ResultAsync } from "neverthrow";
export interface ICoreListener {
  initialize(): ResultAsync<void, never>;
}

export const ICoreListenerType = Symbol.for("ICoreListener");
