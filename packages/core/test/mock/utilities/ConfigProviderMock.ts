import { IConfigOverrides } from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";

import { CoreConfig } from "@core/interfaces/objects/index.js";
import { IConfigProvider } from "@core/interfaces/utilities/index.js";
import {
  controlChainInformation,
  testCoreConfig,
} from "@core-tests/mock/mocks/commonValues";

export class ConfigProviderMock implements IConfigProvider {
  public config: CoreConfig;

  constructor() {
    this.config = testCoreConfig;
  }

  public getConfig(): ResultAsync<CoreConfig, never> {
    return okAsync(this.config);
  }

  public setConfigOverrides(overrides: IConfigOverrides): void {
    this.config = { ...this.config, ...overrides };
  }
}
