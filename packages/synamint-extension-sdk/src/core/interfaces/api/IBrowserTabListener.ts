import { ResultAsync } from "neverthrow";

export interface IBrowserTabListener {
  initialize(): ResultAsync<void, never>;
}

export const IBrowserTabListenerType = Symbol.for("IBrowserTabListener");
