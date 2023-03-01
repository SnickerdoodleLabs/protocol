import { IConfigOverrides } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { CoreConfig } from "../objects/CoreConfig";

export interface IConfigProvider {
  getConfig(): ResultAsync<CoreConfig, never>;
  setConfigOverrides(overrides: IConfigOverrides): void;
}

export const IConfigProviderType = Symbol.for("IConfigProvider");
