import { ContainerModule, interfaces } from "inversify";

import { StemmerService } from "@nlp/implementations/index.js";
import { IStemmerService, IStemmerServiceType } from "@nlp/interfaces/index.js";
export const nlpModule = new ContainerModule(
  (
    bind: interfaces.Bind,
    _unbind: interfaces.Unbind,
    _isBound: interfaces.IsBound,
    _rebind: interfaces.Rebind,
  ) => {
    bind<IStemmerService>(IStemmerServiceType)
      .to(StemmerService)
      .inSingletonScope();
  },
);
