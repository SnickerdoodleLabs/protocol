import { IERC7529ConfigProvider } from "@snickerdoodlelabs/erc7529";
import { IConfigOverrides } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { CoreConfig } from "@core/interfaces/objects/index.js";

export interface IConfigProvider extends IERC7529ConfigProvider {
  getConfig(): ResultAsync<CoreConfig, never>;
  setConfigOverrides(overrides: IConfigOverrides): void;
}

export const IConfigProviderType = Symbol.for("IConfigProvider");
