import { ResultAsync } from "neverthrow";

export interface IErrorListener {
  initialize(): ResultAsync<void, never>;
}

export const IErrorListenerType = Symbol.for("IErrorListener");
