/*
Andrew Strimaitis
Unit Testing for Blockchain Listener - Pull-JSON-from-IPFS
2 classes:
  1. EVMService
  2. EVMServiceMocks
2 interfaces: 
  1. IEVMRepository
  2. IEVMService
*/
import {
  BlockchainProviderError,
  PersistenceError,
  EthereumContractAddress,
  Insight,
  IpfsCID,
  ISDQLQueryObject,
  UninitializedError,
  MissingQueryError,
  EthereumAccountAddress,
  BlockNumber
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { inject, injectable } from "inversify";
import { ResultUtils } from "neverthrow-result-utils";
//import { IQueryService, IQueryServiceType } from "@core/interfaces/business";
/*
import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
  ILogUtils,
  ILogUtilsType,
} from "@core/interfaces/utilities";
*/

import { ChainId } from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";
import td from "testdouble";
import { IBlockchainListener } from "@core/interfaces/api";
import { BlockchainListener } from "@core/implementations/api";
import { IQueryServiceType } from "@browser-extension/interfaces/business";
import { QueryService } from "@browser-extension/implementations/business";
import { QueryParsingEngine } from "@browser-extension/implementations/business/utilities";
import { ConsentContractRepository, InsightPlatformRepository, SDQLQueryRepository } from "@browser-extension/implementations/data";
import { ContextProvider } from "@browser-extension/implementations/utilities";
import { DefaultDataWalletPersistence } from "@browser-extension/implementations/data";
import { BlockchainProvider } from "@browser-extension/implementations/utilities";
import { ConfigProvider } from "../../../core/src/implementations/utilities";
import { LogUtils } from "../../../core/src/implementations/utilities";


import {
  ConsentContractFactory
} from "@core/implementations/utilities/factory";

describe("Blockchain Listener tests", () => {

  let walletpersistence = new DefaultDataWalletPersistence();
  let contextprov = new ContextProvider();
  let logutility = new LogUtils();
  let configprov = new ConfigProvider(logutility);
  // let queryParsingEngine = new QueryParsingEngine();
  let queryParsingEngine = new QueryParsingEngine();
  let sdqlQueryRepo = new SDQLQueryRepository(configprov, contextprov);
  let insightPlatformRepo = new InsightPlatformRepository(configprov);
  let blockprov = new BlockchainProvider(configprov, logutility);
  let consentcontractfactory = new ConsentContractFactory(blockprov);
  let consentRepo = new ConsentContractRepository(insightPlatformRepo, blockprov, contextprov, consentcontractfactory, logutility);
  let contextProvider = new ContextProvider();
  let blockNumber = new BlockNumber();

  let queryd = new QueryService(
    queryParsingEngine,
    sdqlQueryRepo,
    insightPlatformRepo,
    consentRepo,
    contextProvider,
  );


  const ListenerMocks = new BlockchainListener(
    queryd,
    walletpersistence,
    consentRepo,
    blockprov,
    configprov,
    contextprov,
    logutility);


  test("foo() should return 1", async () => {
    // Call the mocks first!
    // returns factory service()
    ListenerMocks.initialize();
    const chainId = ChainId(22);
    const jsonprovider1 = ethers.providers.JsonRpcProvider;
    let accounts = new EthereumAccountAddress[1];
    // Act
    // returns function from EVMService

    const num = await ListenerMocks.monitorChain(
      blockNumber,
      chainId,
      jsonprovider1,
      accounts);

    // Assert
    // run the test - did it pass?
    expect(num.isErr()).toBeFalsy();
    expect(num._unsafeUnwrap()).toStrictEqual(1);
  });

  test("foo() should return 1", async () => {
    // Call the mocks first!
    // returns factory service()
    const mocks = new EVMServiceMocks();
    const fooService = mocks.factoryService();

    // Act
    // returns function from EVMService
    const num = await fooService.foo();

    // Assert
    // run the test - did it pass?
    expect(num.isErr()).toBeFalsy();
    expect(num._unsafeUnwrap()).toStrictEqual(1);
  });
});













interface IEVMRepository {
  getNumber(): ResultAsync<number, never>;
}

interface IEVMService {
  foo(): ResultAsync<number, never>;
}

interface IQueryService {
  getNumber(): ResultAsync<number, never>;
}

interface IDataWalletPersistence {
  getNumber(): ResultAsync<number, never>;
}

interface IBlockchainProvider {
  getNumber(): ResultAsync<number, never>;
}

interface IConfigProvider {
  getNumber(): ResultAsync<number, never>;
}

interface IContextProvider {
  getNumber(): ResultAsync<number, never>;
}

interface ILogUtils {
  getNumber(): ResultAsync<number, never>;
}

class EVMService implements IEVMService {
  public constructor(public EVMRepo: IEVMRepository) { }

  public foo(): ResultAsync<number, never> {
    return this.EVMRepo.getNumber();
  }
}

class EVMServiceMocks {
  public EVMRepo = td.object<IEVMRepository>();

  constructor() {
    td.when(this.EVMRepo.getNumber()).thenReturn(okAsync(1));
  }

  public factoryService(): IEVMService {
    return new EVMService(this.EVMRepo);
  }
}

