import { ApiName } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { CoreContext } from "@core/interfaces/objects/index.js";

export interface IContextProvider {
  getContext(): ResultAsync<CoreContext, never>;
  setContext(context: CoreContext): ResultAsync<void, never>;
  incrementApi(apiName: ApiName): void;
}

export const IContextProviderType = Symbol.for("IContextProvider");
