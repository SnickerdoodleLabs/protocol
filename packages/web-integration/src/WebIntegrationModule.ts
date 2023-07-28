import {
  ILogUtils,
  ILogUtilsType,
  LogUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  IStorageUtils,
  IStorageUtilsType,
  LocalStorageUtils,
} from "@snickerdoodlelabs/utils";
import { ContainerModule, interfaces } from "inversify";

import { IFrameProxyFactory } from "@web-integration/implementations/proxy/index.js";
import {
  IIFrameProxyFactory,
  IIFrameProxyFactoryType,
} from "@web-integration/interfaces/proxy/index.js";

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
    bind<IStorageUtils>(IStorageUtilsType)
      .to(LocalStorageUtils)
      .inSingletonScope();
    bind<ILogUtils>(ILogUtilsType).to(LogUtils).inSingletonScope();
  },
);
