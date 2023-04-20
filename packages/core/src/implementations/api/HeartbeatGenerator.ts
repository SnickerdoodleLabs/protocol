import { ILogUtilsType, ILogUtils } from "@snickerdoodlelabs/common-utils";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IHeartbeatGenerator,
} from "@core/interfaces/api/index.js";
import {
  IConfigProviderType,
  IConfigProvider,
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class HeartbeatGenerator implements IHeartbeatGenerator {
  public constructor(
    @inject(IContextProviderType)
    protected contextProvider: IContextProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  initialize(): ResultAsync<void, never> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
    ]).map(([config, context]) => {
      this.logUtils.debug(
        `Initializing internal heartbeat with ${config.heartbeatIntervalMS} MS`,
      );
      setInterval(() => {
        this.contextProvider.getContext().map((context) => {
          context.heartbeat.next(undefined);
        });
      }, config.heartbeatIntervalMS);

      // Hit the first heartbeat right after startup
      context.heartbeat.next(undefined);
    });
  }
}
