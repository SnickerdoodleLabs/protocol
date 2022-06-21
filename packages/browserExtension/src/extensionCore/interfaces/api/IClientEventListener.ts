import { ResultAsync } from "neverthrow";

export interface IClientEventListener {
  initialize(): ResultAsync<void, never>;
}
