import { URLString } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IShoppingDataProvider } from "./IShoppingDataProvider";

export interface IAmazonProvider extends IShoppingDataProvider {
  getInitializationURL(): ResultAsync<URLString, unknown>;
}
