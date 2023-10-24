import {
  ILogUtils,
  ILogUtilsType,
  ITimeUtils,
  ITimeUtilsType,
  LogUtils,
  TimeUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  IStorageUtils,
  IStorageUtilsType,
  LocalStorageUtils,
} from "@snickerdoodlelabs/utils";
import { ContainerModule, interfaces } from "inversify";

import { BlockchainProviderRepository } from "@web-integration/implementations/data/index.js";
import { IFrameProxyFactory } from "@web-integration/implementations/proxy/index.js";
import { ConfigProvider } from "@web-integration/implementations/utilities/index.js";
import {
  IBlockchainProviderRepository,
  IBlockchainProviderRepositoryType,
} from "@web-integration/interfaces/data/index.js";
import {
  IIFrameProxyFactory,
  IIFrameProxyFactoryType,
} from "@web-integration/interfaces/proxy/index.js";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@web-integration/interfaces/utilities/index.js";

export const webIntegrationModule = new ContainerModule(
  (
    bind: interfaces.Bind,
    _unbind: interfaces.Unbind,
    _isBound: interfaces.IsBound,
    _rebind: interfaces.Rebind,
  ) => {
    bind<IIFrameProxyFactory>(IIFrameProxyFactoryType)
      .to(IFrameProxyFactory)
      .inSingletonScope();

    bind<IBlockchainProviderRepository>(IBlockchainProviderRepositoryType)
      .to(BlockchainProviderRepository)
      .inSingletonScope();

    bind<IStorageUtils>(IStorageUtilsType)
      .to(LocalStorageUtils)
      .inSingletonScope();
    bind<IConfigProvider>(IConfigProviderType)
      .to(ConfigProvider)
      .inSingletonScope();
    bind<ITimeUtils>(ITimeUtilsType).to(TimeUtils).inSingletonScope();
    bind<ILogUtils>(ILogUtilsType).to(LogUtils).inSingletonScope();
  },
);
