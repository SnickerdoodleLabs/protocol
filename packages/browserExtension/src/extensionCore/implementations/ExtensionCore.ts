// Utils
import {
  IAccountCookieUtils,
  IContextProvider,
  IErrorUtils,
} from "@interfaces/utilities";
import {
  AccountCookieUtils,
  ContextProvider,
  ErrorUtils,
} from "@implementations/utilities";

// Utils / Factory
import { IRpcEngineFactory } from "@interfaces/utilities/factory";
import { RpcEngineFactory } from "@implementations/utilities/factory";

// Business
import {
  PortConnectionService,
  AccountService,
  PIIService,
} from "@implementations/business";
import { IAccountService, IPIIService, IPortConnectionService } from "@interfaces/business";

// Repository
import {
  PortConnectionRepository,
  AccountRepository,
  PIIRepository,
} from "@implementations/data";
import {
  IAccountRepository,
  IPIIRepository,
  IPortConnectionRepository,
} from "@interfaces/data";

// API
import {
  ICoreListener,
  IErrorListener,
  IExtensionListener,
  IPortConnectionListener,
  IRpcCallHandler,
} from "@interfaces/api";
import {
  CoreListener,
  ErrorListener,
  ExtensionListener,
  PortConnectionListener,
  RpcCallHandler,
} from "@implementations/api";

// core package
import { SnickerdoodleCore } from "@snickerdoodlelabs/core";

// snickerdoodleobjects
import { ISnickerdoodleCore } from "@snickerdoodlelabs/objects";
import { okAsync } from "neverthrow";

// shared
import { ExtensionUtils } from "@shared/utils/ExtensionUtils";
// shared - config
import { IConfigProvider } from "@shared/interfaces/configProvider";
import ConfigProvider from "@shared/utils/ConfigProvider";


import { LocalStoragePersistence } from "@snickerdoodlelabs/persistence";

export class ExtensionCore {
  // snickerdooldle Core
  protected core: ISnickerdoodleCore;

  // Business
  protected accountService: IAccountService;
  protected portConnectionService: IPortConnectionService;
  protected piiService: IPIIService;

  // Data
  protected accountRepository: IAccountRepository;
  protected portConnectionRepository: IPortConnectionRepository;
  protected piiRepository: IPIIRepository;

  // Utils
  protected contextProvider: IContextProvider;
  protected accountCookieUtils: IAccountCookieUtils;
  protected errorUtils: IErrorUtils;

  // Factory
  protected rpcEngineFactory: IRpcEngineFactory;

  // API
  protected coreListener: ICoreListener;
  protected errorListener: IErrorListener;
  protected extensionListener: IExtensionListener;
  protected portConnectionListener: IPortConnectionListener;
  protected rpcCallHandler: IRpcCallHandler;

  protected configProvider: IConfigProvider;

  constructor() {
    this.core = new SnickerdoodleCore(undefined, new LocalStoragePersistence());

    this.configProvider = ConfigProvider;

    this.coreListener = new CoreListener(this.core);
    this.coreListener.initialize();

    this.contextProvider = new ContextProvider();

    this.accountCookieUtils = new AccountCookieUtils(this.configProvider);
    this.errorUtils = new ErrorUtils(this.contextProvider);

    this.accountRepository = new AccountRepository(
      this.core,
      this.accountCookieUtils,
      this.errorUtils,
    );
    this.accountService = new AccountService(this.accountRepository);

    this.piiRepository = new PIIRepository(this.core, this.errorUtils)
    this.piiService = new PIIService(this.piiRepository);

    this.rpcCallHandler = new RpcCallHandler(
      this.contextProvider,
      this.accountService,
      this.piiService,
    );

    this.rpcEngineFactory = new RpcEngineFactory(
      this.contextProvider,
      this.rpcCallHandler,
    );

    this.portConnectionRepository = new PortConnectionRepository(
      this.contextProvider,
      this.rpcEngineFactory,
      this.configProvider,
    );

    this.portConnectionService = new PortConnectionService(
      this.portConnectionRepository,
    );

    this.extensionListener = new ExtensionListener(this.configProvider);
    this.extensionListener.initialize();

    this.errorListener = new ErrorListener(this.contextProvider);
    this.errorListener.initialize();

    this.portConnectionListener = new PortConnectionListener(
      this.portConnectionService,
    );
    this.portConnectionListener.initialize();

    // TODO enable again once the unlock method on core is complated
    //this.tryUnlock();
  }

  private tryUnlock() {
    this.accountCookieUtils.readAccountInfoFromCookie().andThen((values) => {
      const config = this.configProvider.getConfig();
      if (values?.length) {
        const { accountAddress, signature, languageCode } = values[0];
        return this.accountService
          .unlock(accountAddress, signature, languageCode, true)
          .mapErr((e) => {
            ExtensionUtils.openTab({ url: config.onboardingUrl });
            return okAsync(undefined);
          });
      } else {
        ExtensionUtils.openTab({ url: config.onboardingUrl });
        return okAsync(undefined);
      }
    });
  }
}
