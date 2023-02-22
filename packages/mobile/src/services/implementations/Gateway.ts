import { SnickerdoodleCore } from "@snickerdoodlelabs/core";
import {
  ISnickerdoodleCore,
  ISnickerdoodleCoreEvents,
  ISnickerdoodleCoreType,
} from "@snickerdoodlelabs/objects";
import { Container, inject } from "inversify";
import { MobileStorageUtils } from "./utils/MobileStorageUtils";
import {
  MemoryVolatileStorage,
  NullCloudStorage,
} from "@snickerdoodlelabs/persistence";
import { mobileCoreModule } from "./Gateway.module";
import { coreConfig } from "../interfaces/objects/Config";
import {
  IAccountServiceType,
  IAccountService,
} from "../interfaces/business/IAccountService";
import {
  IInvitationServiceType,
  IInvitationService,
} from "../interfaces/business/IInvitationService";
import {
  IPIIServiceType,
  IPIIService,
} from "../interfaces/business/IPIIService";
import {
  ITokenPriceServiceType,
  ITokenPriceService,
} from "../interfaces/business/ITokenPriceService";
import { ResultAsync } from "neverthrow";
import {
  IAccountStorageUtils,
  IAccountStorageUtilsType,
} from "../interfaces/utils/IAccountStorageUtils";
import { IAccountRepositoryType } from "../interfaces/data/IAccountRepository";

export class MobileCore {
  protected iocContainer: Container;
  protected core: ISnickerdoodleCore;
  constructor() {
    this.iocContainer = new Container();
    this.iocContainer.load(...[mobileCoreModule]);

    this.core = new SnickerdoodleCore(
      coreConfig,
      new MobileStorageUtils(),
      new MemoryVolatileStorage(),
      new NullCloudStorage(),
    );
    this.iocContainer.bind(ISnickerdoodleCoreType).toConstantValue(this.core);
  }

  public getCore() {
    return this.core;
  }

  public getInvitationService() {
    return this.iocContainer.get<IInvitationService>(IInvitationServiceType);
  }
  public getAccountService() {
    return this.iocContainer.get<IAccountService>(IAccountServiceType);
  }
  public getTokenPriceService() {
    return this.iocContainer.get<ITokenPriceService>(ITokenPriceServiceType);
  }
  public getPIIService() {
    return this.iocContainer.get<IPIIService>(IPIIServiceType);
  }
  public getAccountStorageUtils() {
    return this.iocContainer.get<IAccountStorageUtils>(
      IAccountStorageUtilsType,
    );
  }
  public getEvents(): ResultAsync<ISnickerdoodleCoreEvents, never> {
    return this.core.getEvents();
  }
}
