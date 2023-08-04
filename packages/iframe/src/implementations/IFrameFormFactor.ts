import "reflect-metadata";
import {
  ILogUtils,
  ILogUtilsType,
  ITimeUtils,
  ITimeUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  SiteVisit,
  URLString,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { Container } from "inversify";
import { ResultAsync } from "neverthrow";

import { iframeModule } from "@core-iframe/IFrameModule";
import {
  ICoreListener,
  ICoreListenerType,
} from "@core-iframe/interfaces/api/index";
import {
  IConfigProvider,
  IConfigProviderType,
  ICoreProvider,
  ICoreProviderType,
} from "@core-iframe/interfaces/utilities/index";

export class IFrameFormFactor {
  protected iocContainer = new Container();

  public constructor() {
    // Elaborate syntax to demonstrate that we can use multiple modules
    this.iocContainer.load(...[iframeModule]);
  }

  public initialize(): ResultAsync<void, Error> {
    const coreListener =
      this.iocContainer.get<ICoreListener>(ICoreListenerType);
    const coreProvider =
      this.iocContainer.get<ICoreProvider>(ICoreProviderType);
    const timeUtils = this.iocContainer.get<ITimeUtils>(ITimeUtilsType);
    const configProvider =
      this.iocContainer.get<IConfigProvider>(IConfigProviderType);
    const logUtils = this.iocContainer.get<ILogUtils>(ILogUtilsType);

    logUtils.log("Initializing Iframe Form Factor");

    return coreListener
      .activateModel()
      .andThen(() => {
        return coreProvider.getCore();
      })
      .andThen((core) => {
        // We want to record the sourceDomain as a site visit
        const now = timeUtils.getUnixNow();
        const config = configProvider.getConfig();
        return core.addSiteVisits([
          new SiteVisit(
            URLString(config.sourceDomain), // We can't get the full URL, but the domain will suffice
            now, // Visit started now
            UnixTimestamp(now + 10), // We're not going to wait, so just record the visit as for 10 seconds
          ),
        ]);
      })
      .map(() => {
        logUtils.log("Snickerdoodle Core CoreListener initialized");
      });
  }
}
