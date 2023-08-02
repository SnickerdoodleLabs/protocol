import {
  IConfigOverrides,
  ISnickerdoodleCore,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ICoreProvider {
  getCore(): ResultAsync<ISnickerdoodleCore, Error>;

  setConfig(config: IConfigOverrides): ResultAsync<void, Error>;
}

export const ICoreProviderType = Symbol.for("ICoreProvider");
