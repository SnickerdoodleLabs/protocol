/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { SnickerdoodleCore } from "@snickerdoodlelabs/core";
import {
  IConfigOverrides,
  ISnickerdoodleCore,
} from "@snickerdoodlelabs/objects";
import { injectable, inject } from "inversify";
import { ResultAsync } from "neverthrow";

import {
  IConfigProvider,
  IConfigProviderType,
  ICoreProvider,
} from "@core-iframe/interfaces/utilities/index";

@injectable()
export class CoreProvider implements ICoreProvider {
  protected corePromise: Promise<ISnickerdoodleCore>;
  protected corePromiseResolve: ((ISnickerdoodleCore) => void) | null = null;
  protected core: ISnickerdoodleCore | null = null;

  public constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
  ) {
    this.corePromise = new Promise((resolve) => {
      this.corePromiseResolve = resolve;
    });
  }
  public getCore(): ResultAsync<ISnickerdoodleCore, Error> {
    return ResultAsync.fromSafePromise(this.corePromise);
  }

  public setConfig(config: IConfigOverrides): ResultAsync<void, Error> {
    console.log(
      "Setting configuration overrides and creating Snickerdoodle Core instance",
    );

    // A few critical pieces of configuration are baked into the iframe at build time.
    // This is a security measure- you don't want a bad site overriding certain
    // values to dangerous ones willy-nilly.
    const immutableConfig = this.configProvider.getConfig();
    config.controlChainId = immutableConfig.controlChainId;
    config.ipfsFetchBaseUrl = immutableConfig.ipfsFetchBaseUrl;
    config.defaultInsightPlatformBaseUrl =
      immutableConfig.defaultInsightPlatformBaseUrl;
    config.devChainProviderURL =
      immutableConfig.devChainProviderURL ?? undefined;
    config.accountBalancePollingIntervalMS =
      immutableConfig.portfolioPollingIntervalMS;
    config.accountIndexingPollingIntervalMS =
      immutableConfig.transactionPollingIntervalMS;
    config.dataWalletBackupIntervalMS = immutableConfig.backupPollingIntervalMS;
    config.requestForDataCheckingFrequency =
      immutableConfig.requestForDataPollingIntervalMS;

    // This probably needs to go away entirely
    config.enableBackupEncryption = false;

    this.core = new SnickerdoodleCore(config);

    return this.core.initialize().map(() => {
      this.corePromiseResolve!(this.core);
    });
  }
}
