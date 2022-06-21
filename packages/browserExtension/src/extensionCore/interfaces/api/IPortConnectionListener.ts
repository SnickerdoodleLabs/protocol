import { ResultAsync } from "neverthrow";

export interface IPortConnectionListener {
  initialize(): ResultAsync<void, never>;
}
