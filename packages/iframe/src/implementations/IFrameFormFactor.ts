import "reflect-metadata";
import {
  ILogUtils,
  ILogUtilsType,
  ITimeUtils,
  ITimeUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  EChain,
  EVMAccountAddress,
  LanguageCode,
  Signature,
  SiteVisit,
  URLString,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { IStorageUtils, IStorageUtilsType } from "@snickerdoodlelabs/utils";
import { Container } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

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
    const storageUtils =
      this.iocContainer.get<IStorageUtils>(IStorageUtilsType);
    const timeUtils = this.iocContainer.get<ITimeUtils>(ITimeUtilsType);
    const configProvider =
      this.iocContainer.get<IConfigProvider>(IConfigProviderType);
    const logUtils = this.iocContainer.get<ILogUtils>(ILogUtilsType);

    logUtils.log("Initializing Iframe Form Factor");

    return coreListener
      .activateModel()
      .andThen(() => {
        // Check if we have a stored signature
        return ResultUtils.combine([
          coreProvider.getCore(),
          storageUtils.read<EVMAccountAddress>("storedAccountAddress"),
          storageUtils.read<Signature>("storedSignature"),
          storageUtils.read<EChain>("storedChain"),
          storageUtils.read<LanguageCode>("storedLanguageCode"),
        ]).andThen(([core, accountAddress, signature, chain, languageCode]) => {
          if (
            accountAddress != null &&
            chain != null &&
            signature != null &&
            languageCode != null
          ) {
            logUtils.log(
              "Unlocking Snickerdoodle Core using stored unlock values",
            );
            // If we have a stored signature, we can automatically unlock the
            return core.account
              .unlock(accountAddress, signature, languageCode, chain)
              .map(() => {
                logUtils.log(
                  "Snickerdoodle Core unlocked using stored unlock values",
                );
              });
          }
          // If there's no stored signature, we have to wait for unlock to be called
          return okAsync(undefined);
        });
      })
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
