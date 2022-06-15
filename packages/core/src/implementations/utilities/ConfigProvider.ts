import { ChainId, URLString } from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { CoreConfig } from "@core/interfaces/objects";
import { IConfigProvider } from "@core/interfaces/utilities";

declare const __CONTROL_CHAIN_ID__: number | undefined;

@injectable()
export class ConfigProvider implements IConfigProvider {
  protected config: CoreConfig;

  public constructor() {
    this.config = new CoreConfig(
      __CONTROL_CHAIN_ID__ != null
        ? ChainId(__CONTROL_CHAIN_ID__)
        : ChainId(1337),
      URLString(""),
    );
  }

  public getConfig(): ResultAsync<CoreConfig, never> {
    return okAsync(this.config);
  }
}
