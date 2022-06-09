import { ChainId, URLString } from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { QueryEngineConfig } from "@query-engine/interfaces/objects";
import { IConfigProvider } from "@query-engine/interfaces/utilities";

declare const __CONTROL_CHAIN_ID__: number | undefined;

@injectable()
export class ConfigProvider implements IConfigProvider {
  protected config: QueryEngineConfig;

  public constructor() {
    this.config = new QueryEngineConfig(
      __CONTROL_CHAIN_ID__ != null
        ? ChainId(__CONTROL_CHAIN_ID__)
        : ChainId(1337),
      URLString(""),
    );
  }

  public getConfig(): ResultAsync<QueryEngineConfig, never> {
    return okAsync(this.config);
  }
}
