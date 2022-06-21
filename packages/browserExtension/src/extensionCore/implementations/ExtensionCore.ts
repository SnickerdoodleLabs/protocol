// Utils
import {
  IConfigProvider,
  IContextProvider,
  IPortConnectionUtils,
} from "@interfaces/utilities";
import {
  ConfigProvider,
  ContextProvider,
  PortConnectionUtils,
} from "@implementations/utilities";

// Utils / Factory
import {
  IInternalRpcMiddlewareFactory,
  IRpcEngineFactory,
} from "@interfaces/utilities/factory";
import {
  InternalRpcMiddlewareFactory,
  RpcEngineFactory,
} from "@implementations/utilities/factory";

// Business
import { PortConnectionService } from "@implementations/business";
import { IPortConnectionService } from "@interfaces/business";

// Repository
import { PortConnectionRepository } from "@implementations/data";
import { IPortConnectionRepository } from "@interfaces/data";

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

// objects
import { IExtensionCore } from "@interfaces/objects";

// core package
import { QueryEngine } from "@snickerdoodlelabs/core";

// snickerdoodleobjects
import { IQueryEngine } from "@snickerdoodlelabs/objects";

export class ExtensionCore implements IExtensionCore {
  // snickerdooldle Core
  protected core: IQueryEngine;

  // Business
  protected portConnectionService: IPortConnectionService;

  // Data
  protected portConnectionRepository: IPortConnectionRepository;

  // Utils
  protected configProvider: IConfigProvider;
  protected contextProvider: IContextProvider;
  protected portConnectionUtils: IPortConnectionUtils;
  // Factory
  protected rpcMiddlewareFactory: IInternalRpcMiddlewareFactory;
  protected rpcEngineFactory: IRpcEngineFactory;

  // API
  protected clientEventListener: IClientEventListener;
  protected coreListener: ICoreListener;
  protected portConnectionListenner: IPortConnectionListener;

  constructor() {
    this.core = new QueryEngine();

    this.coreListener = new CoreListener(this.core);
    this.coreListener.initialize();

    this.contextProvider = new ContextProvider();

    this.rpcMiddlewareFactory = new InternalRpcMiddlewareFactory(
      this.contextProvider,
    );
    this.rpcEngineFactory = new RpcEngineFactory(
      this.contextProvider,
      this.rpcMiddlewareFactory,
    );
    this.clientEventListener = new ClientEventsListener(this.contextProvider);
    this.portConnectionUtils = new PortConnectionUtils(this.contextProvider);

    this.portConnectionRepository = new PortConnectionRepository(
      this.contextProvider,
      this.rpcEngineFactory,
    );

    this.portConnectionService = new PortConnectionService(
      this.portConnectionRepository,
    );

    this.portConnectionListenner = new PortConnectionListener(
      this.contextProvider,
      this.portConnectionService,
    );

    this.configProvider = new ConfigProvider();
  }
}
