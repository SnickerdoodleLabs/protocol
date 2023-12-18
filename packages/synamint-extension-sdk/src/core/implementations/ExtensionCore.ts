import { SnickerdoodleCore } from "@snickerdoodlelabs/core";
import {
  AjaxError,
  BlockchainProviderError,
  IConfigOverrides,
  IExtensionConfigOverrides,
  IExtensionSdkConfigOverrides,
  ISnickerdoodleCore,
  ISnickerdoodleCoreType,
  PersistenceError,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ChromeStorageUtils } from "@snickerdoodlelabs/utils";
import { Container } from "inversify";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { extensionCoreModule } from "@synamint-extension-sdk/core/implementations/ExtensionCore.module";
import {
  IBrowserTabListener,
  IBrowserTabListenerType,
  ICoreListener,
  ICoreListenerType,
  IErrorListener,
  IErrorListenerType,
  IPortConnectionListener,
  IPortConnectionListenerType,
} from "@synamint-extension-sdk/core/interfaces/api";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@synamint-extension-sdk/core/interfaces/utilities";

export class ExtensionCore {
  protected iocContainer: Container;

  // snickerdooldle Core
  protected core: ISnickerdoodleCore;

  constructor(config: IExtensionSdkConfigOverrides) {
    this.iocContainer = new Container();

    // Elaborate syntax to demonstrate that we can use multiple modules
    this.iocContainer.load(...[extensionCoreModule]);

    const configProvider =
      this.iocContainer.get<IConfigProvider>(IConfigProviderType);
    // override configs
    configProvider.setConfigOverrides(config);
    const coreConfig = configProvider.getCoreConfig();

    this.core = new SnickerdoodleCore(
      coreConfig,
      new ChromeStorageUtils(),
      undefined,
    );

    // Make the core directly injectable
    this.iocContainer.bind(ISnickerdoodleCoreType).toConstantValue(this.core);
  }

  public initialize(): ResultAsync<
    ISnickerdoodleCore,
    PersistenceError | UninitializedError | BlockchainProviderError | AjaxError
  > {
    return this.core
      .initialize()
      .andThen(() => {
        const browserTabListener = this.iocContainer.get<IBrowserTabListener>(
          IBrowserTabListenerType,
        );
        const coreListener =
          this.iocContainer.get<ICoreListener>(ICoreListenerType);
        const errorListener =
          this.iocContainer.get<IErrorListener>(IErrorListenerType);
        const portConnectionListener =
          this.iocContainer.get<IPortConnectionListener>(
            IPortConnectionListenerType,
          );
        return ResultUtils.combine([
          coreListener.initialize(),
          browserTabListener.initialize(),
          errorListener.initialize(),
          portConnectionListener.initialize(),
        ]);
      })
      .map(() => {
        return this.core;
      });
  }
}
