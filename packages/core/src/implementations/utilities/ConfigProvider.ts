import {
  chainConfig,
  ChainId,
  ControlChainInformation,
  URLString,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { CoreConfig } from "@core/interfaces/objects";
import { IConfigProvider, ILogUtils } from "@core/interfaces/utilities";

declare const __CONTROL_CHAIN_ID__: number | undefined;

@injectable()
export class ConfigProvider implements IConfigProvider {
  protected config: CoreConfig;

  public constructor(
    protected logUtils: ILogUtils,
    config?: Partial<CoreConfig>,
  ) {
    const controlChainId =
      config?.controlChainId || __CONTROL_CHAIN_ID__ || 1337;
    const controlChainInformation = chainConfig.get(ChainId(controlChainId));

    if (controlChainInformation == null) {
      throw new Error(
        `Invalid configuration! No ChainInformation exists for control chain ${controlChainId}`,
      );
    }

    if (!(controlChainInformation instanceof ControlChainInformation)) {
      throw new Error(
        `Invalid configuration! Control chain ${controlChainInformation} is not a ControlChainInformation`,
      );
    }

    this.config = new CoreConfig(
      ChainId(controlChainId),
      config?.providerAddress || URLString(""),
      config?.chainInformation || chainConfig,
      config?.controlChainInformation || controlChainInformation,
      URLString("ipfs node address"),
    );
  }

  public getConfig(): ResultAsync<CoreConfig, never> {
    return okAsync(this.config);
  }
}
