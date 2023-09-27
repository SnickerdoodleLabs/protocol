import { URLString } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IShoppingDataProvider {
  getInitializationURL(): ResultAsync<URLString, unknown>;
}
