import "reflect-metadata";

import {
  ILogUtils,
  IBigNumberUtils,
  TimeUtils,
  ITimeUtilsType,
  ITimeUtils,
} from "@snickerdoodlelabs/common-utils";
import { IMasterIndexer } from "@snickerdoodlelabs/indexers";
import {
  EDataProvider,
  EChain,
  EVMTransaction,
  ERecordKey,
  UnixTimestamp,
  EIndexerMethod,
  EFieldKey,
  WalletNFTHistory,
  NftIdWithMeasurementDate,
} from "@snickerdoodlelabs/objects";
import { IPersistenceConfigProvider } from "@snickerdoodlelabs/persistence";
import { okAsync } from "neverthrow";
import * as td from "testdouble";

import { NftRepository } from "@core/implementations/data";
import {
  IDataWalletPersistence,
  ILinkedAccountRepository,
  INftRepository,
} from "@core/interfaces/data";
import {
  cachedNfts,
  earnedRewards,
  indexedNftHistory,
  indexedNfts,
  linkedAccounts,
  Nfts,
  walletNftThatGotTransferredAndGotBack,
  walletNftWithHistory,
} from "@core-tests/mock/mocks/commonValues";
import { ContextProviderMock } from "@core-tests/mock/utilities/ContextProviderMock";
import { ConfigProviderMock } from "@core-tests/mock/utilities/index.js";

const persistenceMap = new Map<
  ERecordKey,
  Map<string, Record<string, unknown>>
>();
let indexTime = 0;
let indexIndexer = 0;
class NftRepositoryMocks {
  public contextProvider: ContextProviderMock;
  public configProvider: IPersistenceConfigProvider;
  public timeUtils: ITimeUtils;
  public accountRepo: ILinkedAccountRepository;
  public persistence: IDataWalletPersistence;
  public logUtils: ILogUtils;
  public masterIndexer: IMasterIndexer;

  public constructor() {
    this.contextProvider = new ContextProviderMock();
    this.configProvider = new ConfigProviderMock();
    this.logUtils = td.object<ILogUtils>();
    this.accountRepo = td.object<ILinkedAccountRepository>();
    this.persistence = td.object<IDataWalletPersistence>();
    this.masterIndexer = td.object<IMasterIndexer>();
    this.timeUtils = td.object<ITimeUtils>();

    td.when(this.timeUtils.getUnixNow()).thenDo(() => {
      if (indexTime < 2) {
        indexTime++;
        //First 2, initial nft addition
        return UnixTimestamp(1701779730);
      }
      if (indexTime < 3) {
        //Transferred 1 nft
        indexTime++;
        return UnixTimestamp(1701779734);
      }
      //User got the nft back
      return UnixTimestamp(1701779738);
    });

    td.when(this.accountRepo.getEarnedRewards()).thenReturn(
      okAsync(earnedRewards),
    );

    td.when(this.accountRepo.getAccounts()).thenReturn(okAsync(linkedAccounts));
    td.when(
      this.masterIndexer.getSupportedChains(EIndexerMethod.NFTs),
    ).thenReturn(okAsync([43113]));

    td.when(
      this.masterIndexer.getLatestNFTs(
        43113,
        linkedAccounts[0].sourceAccountAddress,
      ),
    ).thenDo(() => {
      if (indexIndexer < 2) {
        indexIndexer++;
        //First 2, call return all nfts
        return okAsync(Nfts);
      }
      if (indexIndexer < 3) {
        //Transferred 1 nft
        indexIndexer++;
        return okAsync(Nfts.slice(1));
      }
      //User got the nft back
      return okAsync(Nfts);
    });

    td.when(this.persistence.getAll(td.matchers.anything())).thenDo(
      (key: ERecordKey) => {
        const innerMap = persistenceMap.get(key);
        const innerValues = innerMap ? [...innerMap.values()] : [];
        return okAsync(innerValues);
      },
    );

    td.when(
      this.persistence.updateRecord(
        td.matchers.anything(),
        td.matchers.anything(),
      ),
    ).thenDo((key: ERecordKey, value: Record<string, unknown>) => {
      if (!persistenceMap.has(key)) {
        persistenceMap.set(key, new Map<string, Record<string, unknown>>());
      }
      const innerMap = persistenceMap.get(key);
      if (typeof value.id === "string") {
        innerMap!.set(value.id, value);
      }

      return okAsync(undefined);
    });
  }

  public factory(): INftRepository {
    return new NftRepository(
      this.contextProvider,
      this.configProvider,
      this.accountRepo,
      this.persistence,
      this.masterIndexer,
      this.timeUtils,
      this.logUtils,
    );
  }
}

describe("NftRepository", () => {
  beforeEach(() => {
    indexTime = 0;
    indexIndexer = 0;
    persistenceMap.clear();
  });
  test("no benchmark given should only shibuya nft since db is not populated", async () => {
    // Arrange
    const mocks = new NftRepositoryMocks();
    const service = mocks.factory();

    //Act
    await service.getCachedNFTs().map((result) => {
      const shibuyaResult = walletNftWithHistory.slice(0, 1);
      expect(result).toEqual(shibuyaResult);
    });
  });

  test("benchmark given, since cache does not exist will trigger indexers but the dates are later than the benchmark, will not return the new data", async () => {
    // Arrange
    const mocks = new NftRepositoryMocks();
    const service = mocks.factory();

    //Act
    // Will trigger data, but the query is not qualified, only shibuya will return
    await service.getCachedNFTs(UnixTimestamp(1701779729)).andThen((result) => {
      const shibuyaResult = walletNftWithHistory.slice(0, 1);
      expect(result).toEqual(shibuyaResult);
      return service.getCache().map((cache) => {
        // Timestamp from indexer
        expect(cache.get(43113)?.lastUpdateTime).toEqual(1701779730);
      });
    });
  });

  test("benchmark given should get nfts from cache and return all wallet nfts with history", async () => {
    // Arrange
    const mocks = new NftRepositoryMocks();
    const service = mocks.factory();

    //Act
    await service.getCachedNFTs(UnixTimestamp(1701779734)).andThen((result) => {
      expect(result).toEqual(walletNftWithHistory);
      return service.getCache().map((cache) => {
        expect(cache.get(43113)?.lastUpdateTime).toEqual(1701779734);
      });
    });
  });

  test("2 nft should be on the nft table, 2 nft history should be recorded ", async () => {
    // Arrange
    const mocks = new NftRepositoryMocks();
    const service = mocks.factory();

    // Will trigger data, but the query is not qualified, only shibuya will return
    await service.getCachedNFTs(UnixTimestamp(1701779729));

    //Act
    await service.getNFTsHistory().map((nftHistories) => {
      expect(nftHistories).toEqual(indexedNftHistory.slice(0, 2));
    });

    await service.getPersistenceNFTs().map((nfts) => {
      expect(nfts).toEqual(indexedNfts);
    });
  });

  test("returns all nfts first, receive remove event, return single nft ", async () => {
    // Arrange
    const mocks = new NftRepositoryMocks();
    const service = mocks.factory();

    //Act
    //Trigger first call, should get all cache is set to 1701779734
    await service.getCachedNFTs(UnixTimestamp(1701779734)).andThen((result) => {
      expect(result).toEqual(walletNftWithHistory);
      return service.getCache().map((cache) => {
        expect(cache.get(43113)?.lastUpdateTime).toEqual(1701779734);
      });
    });

    // 2. call, same nfts returned no change
    await service.getCachedNFTs(UnixTimestamp(1701779736));
    //Act
    //3. call, 1 nft is missing (user transferred), will create a record for nft transfer
    await service.getCachedNFTs(UnixTimestamp(1701779737)).andThen((result) => {
      expect(result).toEqual([
        walletNftWithHistory[0],
        walletNftWithHistory[2],
      ]);
      return service.getCache().map((cache) => {
        //Cache updated

        expect(cache.get(43113)?.lastUpdateTime).toEqual(1701779737);
      });
    });
  });

  test("2 nft should be on the nft table, 3 nft history should be recorded ", async () => {
    // Arrange
    const mocks = new NftRepositoryMocks();
    const service = mocks.factory();

    //Act
    await service.getCachedNFTs(UnixTimestamp(1701779734));
    await service.getCachedNFTs(UnixTimestamp(1701779736));
    await service.getCachedNFTs(UnixTimestamp(1701779737));
    //Act
    await service.getNFTsHistory().map((nftHistories) => {
      expect(nftHistories).toEqual(indexedNftHistory);
    });

    await service.getPersistenceNFTs().map((nfts) => {
      expect(nfts).toEqual(indexedNfts);
    });
  });

  test("User transfers an existing nft, then gets it back, final result should reflect it ", async () => {
    // Arrange
    const mocks = new NftRepositoryMocks();
    const service = mocks.factory();

    //Act
    // initial call adds 2 nfts with 2 nft history with added record
    await service.getCachedNFTs(UnixTimestamp(1701779734));
    // 2. call, same nfts returned no change
    await service.getCachedNFTs(UnixTimestamp(1701779736)); //

    // 3. call, 1 nft is missing (user transferred), will create a record for nft transfer
    await service.getCachedNFTs(UnixTimestamp(1701779737)).andThen((result) => {
      expect(result).toEqual([
        walletNftWithHistory[0],
        walletNftWithHistory[2],
      ]);
      return service.getCache().map((cache) => {
        //Cache updated
        expect(cache.get(43113)?.lastUpdateTime).toEqual(1701779737);
      });
    });

    await service.getNFTsHistory().map((nftHistories) => {
      expect(nftHistories).toEqual(indexedNftHistory);
    });

    // Final call, got the nft back
    await service.getCachedNFTs(UnixTimestamp(1701779738)).andThen((result) => {
      expect(result).toEqual([
        walletNftWithHistory[0],
        walletNftThatGotTransferredAndGotBack,
        walletNftWithHistory[2],
      ]);
      return service.getCache().map((cache) => {
        //Cache updated
        expect(cache.get(43113)?.lastUpdateTime).toEqual(1701779738);
      });
    });

    await service.getNFTsHistory().map((nftHistories) => {
      expect(nftHistories).toEqual([
        ...indexedNftHistory,
        {
          id: "0x0a281d992a7e454d9dcf611b6bf0201393e27438|#|0{-}1701779738",
          event: 1,
          amount: "1",
        },
      ]);
    });
  });

  test("Latest cache holds 1 nft , 1 transferred but benchmark transfer date should get all the nfts  ", async () => {
    // Arrange
    const mocks = new NftRepositoryMocks();
    const service = mocks.factory();

    //Act
    // initial call adds 2 nfts with 2 nft history with added record
    await service.getCachedNFTs(UnixTimestamp(1701779734));
    // 2. call, same nfts returned no change
    await service.getCachedNFTs(UnixTimestamp(1701779736)); //

    // 3. call, 1 nft is missing (user transferred), will create a record for nft transfer
    await service.getCachedNFTs(UnixTimestamp(1701779737)).andThen((result) => {
      expect(result).toEqual([
        walletNftWithHistory[0],
        walletNftWithHistory[2],
      ]);
      return service.getCache().map((cache) => {
        //Cache updated
        expect(cache.get(43113)?.lastUpdateTime).toEqual(1701779737);
      });
    });

    await service.getCachedNFTs(UnixTimestamp(1701779732)).andThen((result) => {
      // Latest data returns 2 nft but this will return an earlier snapshot where all 3 where valid
      expect(result).toEqual(walletNftWithHistory);
      return service.getCache().map((cache) => {
        //Cache updated
        expect(cache.get(43113)?.lastUpdateTime).toEqual(1701779737);
      });
    });
  });
});
