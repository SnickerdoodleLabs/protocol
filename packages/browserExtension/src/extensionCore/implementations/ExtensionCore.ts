// Utils
import { IAccountCookieUtils, IContextProvider } from "@interfaces/utilities";
import {
  AccountCookieUtils,
  ContextProvider,
} from "@implementations/utilities";

// Utils / Factory
import {
  IExternalRpcMiddlewareFactory,
  IInternalRpcMiddlewareFactory,
  IRpcEngineFactory,
} from "@interfaces/utilities/factory";
import {
  ExternalRpcMiddlewareFactory,
  InternalRpcMiddlewareFactory,
  RpcEngineFactory,
} from "@implementations/utilities/factory";

// Business
import {
  PortConnectionService,
  AccountService,
} from "@implementations/business";
import { IAccountService, IPortConnectionService } from "@interfaces/business";

// Repository
import {
  PortConnectionRepository,
  AccountRepository,
} from "@implementations/data";
import {
  IAccountRepository,
  IPortConnectionRepository,
} from "@interfaces/data";

// API
import {
  IClientEventListener,
  ICoreListener,
  IPortConnectionListener,
} from "@interfaces/api";
import {
  ClientEventsListener,
  CoreListener,
  PortConnectionListener,
} from "@implementations/api";

// core package
import { SnickerdoodleCore } from "@snickerdoodlelabs/core";

// snickerdoodleobjects
import { ISnickerdoodleCore } from "@snickerdoodlelabs/objects";
import Browser from "webextension-polyfill";
import { okAsync } from "neverthrow";
import { ExtensionUtils } from "@shared/utils/ExtensionUtils";
import { BrowserUtils } from "@enviroment/shared/utils";
import Config from "@shared/constants/Config";

export class ExtensionCore {
  // snickerdooldle Core
  protected core: ISnickerdoodleCore;

  // Business
  protected accountService: IAccountService;
  protected portConnectionService: IPortConnectionService;

  // Data
  protected accountRepository: IAccountRepository;
  protected portConnectionRepository: IPortConnectionRepository;

  // Utils
  protected contextProvider: IContextProvider;
  protected accountCookieUtils: IAccountCookieUtils;

  // Factory
  protected externalRpcMiddlewareFactory: IExternalRpcMiddlewareFactory;
  protected internalRpcMiddlewareFactory: IInternalRpcMiddlewareFactory;
  protected rpcEngineFactory: IRpcEngineFactory;

  // API
  protected clientEventListener: IClientEventListener;
  protected coreListener: ICoreListener;
  protected portConnectionListener: IPortConnectionListener;

  constructor() {
    this.core = new SnickerdoodleCore();

    this.coreListener = new CoreListener(this.core);
    this.coreListener.initialize();

    this.contextProvider = new ContextProvider();

    this.internalRpcMiddlewareFactory = new InternalRpcMiddlewareFactory(
      this.contextProvider,
    );

    this.externalRpcMiddlewareFactory = new ExternalRpcMiddlewareFactory(
      this.contextProvider,
    );
    this.rpcEngineFactory = new RpcEngineFactory(
      this.contextProvider,
      this.internalRpcMiddlewareFactory,
      this.externalRpcMiddlewareFactory,
    );

    this.accountCookieUtils = new AccountCookieUtils();

    this.accountRepository = new AccountRepository(
      this.core,
      this.accountCookieUtils,
    );
    this.accountService = new AccountService(this.accountRepository);

    this.portConnectionRepository = new PortConnectionRepository(
      this.contextProvider,
      this.rpcEngineFactory,
    );

    this.portConnectionService = new PortConnectionService(
      this.portConnectionRepository,
    );
    this.clientEventListener = new ClientEventsListener(
      this.contextProvider,
      this.accountService,
    );
    this.clientEventListener.initialize();

    this.portConnectionListener = new PortConnectionListener(
      this.portConnectionService,
    );
    this.portConnectionListener.initialize();

    this.listenExtensionIconClicks();
    this.keepAliveServiceWorker();

    // TODO enable again once the unlock method on core is complated
    //this.tryUnlock();
  }

  private tryUnlock() {
    this.accountCookieUtils.readAccountInfoFromCookie().andThen((values) => {
      if (values?.length) {
        const { accountAddress, signature, languageCode } = values[0];
        return this.accountService
          .unlock(accountAddress, signature, languageCode, true)
          .mapErr((e) => {
            ExtensionUtils.openTab({ url: Config.onboardingUrl });
            return okAsync(undefined);
          });
      }
      ExtensionUtils.openTab({ url: Config.onboardingUrl });
      return okAsync(undefined);
    });
  }

  private listenExtensionIconClicks() {
    // this can check whether onboarding complated or not
    BrowserUtils.browserAction.onClicked.addListener((info, tab) => {
      BrowserUtils.browserAction.setPopup({ popup: "popup.html" });
    });
  }

  private keepAliveServiceWorker() {}
}
