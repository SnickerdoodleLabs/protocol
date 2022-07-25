import { ResultAsync } from "neverthrow";
export interface IExtensionListener {
  initialize(): ResultAsync<void, never>;
}
