import { ContainerModule, interfaces } from "inversify";

import { BlockchainListener } from "@query-engine/implementations/api";
import { AccountService } from "@query-engine/implementations/business/AccountService";
import { InsightPlatformRepository } from "@query-engine/implementations/data/InsightPlatformRepository";
import {
  ConfigProvider,
  ContextProvider,
} from "@query-engine/implementations/utilities";
import {
  IBlockchainListener,
  IBlockchainListenerType,
} from "@query-engine/interfaces/api";
import {
  IAccountService,
  IAccountServiceType,
} from "@query-engine/interfaces/business";
import {
  IInsightPlatformRepository,
  IInsightPlatformRepositoryType,
} from "@query-engine/interfaces/data";
import {
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
} from "@query-engine/interfaces/utilities";

export const queryEngineModule = new ContainerModule(
  (
    bind: interfaces.Bind,
    _unbind: interfaces.Unbind,
    _isBound: interfaces.IsBound,
    _rebind: interfaces.Rebind,
  ) => {
    bind<IBlockchainListener>(IBlockchainListenerType)
      .to(BlockchainListener)
      .inSingletonScope();

    bind<IAccountService>(IAccountServiceType)
      .to(AccountService)
      .inSingletonScope();

    bind<IInsightPlatformRepository>(IInsightPlatformRepositoryType)
      .to(InsightPlatformRepository)
      .inSingletonScope();

    bind<IConfigProvider>(IConfigProviderType)
      .to(ConfigProvider)
      .inSingletonScope();

    bind<IContextProvider>(IContextProviderType)
      .to(ContextProvider)
      .inSingletonScope();
  },
);
