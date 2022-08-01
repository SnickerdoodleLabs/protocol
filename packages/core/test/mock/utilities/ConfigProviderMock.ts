import { IConfigOverrides } from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";

import { controlChainInformation, testCoreConfig } from "../mocks";

import { CoreConfig } from "@core/interfaces/objects";
import { IConfigProvider } from "@core/interfaces/utilities";

export class ConfigProviderMock implements IConfigProvider {
  protected config: CoreConfig;

  constructor() {
    // console.log(controlChainInformation);
    this.config = testCoreConfig;
  }

  public getConfig(): ResultAsync<CoreConfig, never> {
    return okAsync(this.config);
  }

  public setConfigOverrides(overrides: IConfigOverrides): void {
    this.config = { ...this.config, ...overrides };
  }
}
