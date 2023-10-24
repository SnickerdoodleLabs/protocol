import { ContainerModule, interfaces } from "inversify";

import {
  ProductUtils,
  PurchaseUtils,
} from "@shopping-data/implementations/index.js";
import {
  IProductUtils,
  IProductUtilsType,
  IPurchaseUtils,
  IPurchaseUtilsType,
} from "@shopping-data/interfaces/index.js";

export const shoppingDataModule = new ContainerModule(
  (
    bind: interfaces.Bind,
    _unbind: interfaces.Unbind,
    _isBound: interfaces.IsBound,
    _rebind: interfaces.Rebind,
  ) => {
    bind<IPurchaseUtils>(IPurchaseUtilsType)
      .to(PurchaseUtils)
      .inSingletonScope();
    bind<IProductUtils>(IProductUtilsType).to(ProductUtils).inSingletonScope();
  },
);
