import "reflect-metadata";

import {
  IBigNumberUtils,
  ILogUtils,
  ITimeUtils,
} from "@snickerdoodlelabs/common-utils";
import { IMasterIndexer } from "@snickerdoodlelabs/indexers";
import {
  ERecordKey,
  UnixTimestamp,
  EIndexerMethod,
  EVMAccountAddress,
  BigNumberString,
  WalletNFT,
} from "@snickerdoodlelabs/objects";
import { IPersistenceConfigProvider } from "@snickerdoodlelabs/persistence";
import { Result, ResultAsync, okAsync } from "neverthrow";
import * as td from "testdouble";

import { NftRepository } from "@core/implementations/data";
import {
  IDataWalletPersistence,
  INFTRepositoryWithDebug,
} from "@core/interfaces/data";
import {
  earnedRewards,
  indexedNftInitialHistory,
  indexedNfts,
  linkedAccounts,
  expectedNfts,
  nftThatGotTransferredAndGotBack,
  expectedShibuya,
  expectedFujiNfts,
  expectedPolygon,
  indexedNftTransferlHistory,
  fujiOwner,
  polygonOwner,
  fujiIndexerResponseAfterRegainingTheNft,
  fujiNfts,
  polygonNfts,
} from "@core-tests/mock/mocks/commonValues";
import { ContextProviderMock } from "@core-tests/mock/utilities/ContextProviderMock";
import { ConfigProviderMock } from "@core-tests/mock/utilities/index.js";

const persistenceMap = new Map<
  ERecordKey,
  Map<string, Record<string, unknown>>
>([]);
let currentTime = UnixTimestamp(1701779734);
let latestFujiNFTs: WalletNFT[] = fujiNfts;
let latestPolygonNFTs: WalletNFT[] = polygonNfts;

//Key points
//Nfts first added at 1701779730, are supplied with indexer nft data
//User Transfers 1 fuji at 1701779734
//User Regains the fuji at 1701779738
class NftRepositoryMocks {
  public contextProvider: ContextProviderMock;
  public configProvider: IPersistenceConfigProvider;
  public timeUtils: ITimeUtils;
  public persistence: IDataWalletPersistence;
  public logUtils: ILogUtils;
  public masterIndexer: IMasterIndexer;
  public bigNumberUtils: IBigNumberUtils;

  public constructor() {
    this.contextProvider = new ContextProviderMock();
    this.configProvider = new ConfigProviderMock();
    this.logUtils = td.object<ILogUtils>();
    this.persistence = td.object<IDataWalletPersistence>();
    this.masterIndexer = td.object<IMasterIndexer>();
    this.timeUtils = td.object<ITimeUtils>();
    this.bigNumberUtils = td.object<IBigNumberUtils>();

    td.when(this.timeUtils.getUnixNow()).thenReturn(currentTime);
    td.when(
      this.masterIndexer.getSupportedChains(EIndexerMethod.NFTs),
    ).thenReturn(okAsync([43113, 137]));

    td.when(this.bigNumberUtils.BNSToBN(td.matchers.anything())).thenDo(
      (bigNumberString: BigNumberString) => {
        return BigInt(bigNumberString);
      },
    );

    td.when(this.bigNumberUtils.BNToBNS(td.matchers.anything())).thenDo(
      (bigNumber: bigint) => {
        return BigNumberString(BigInt(bigNumber).toString());
      },
    );

    td.when(
      this.masterIndexer.getLatestNFTs(
        td.matchers.anything(),
        td.matchers.anything(),
      ),
    ).thenDo((chain: number, accountAddress: EVMAccountAddress) => {
      if (chain === 43113 && accountAddress === fujiOwner) {
        return okAsync(latestFujiNFTs);
      }
      if (chain === 137 && accountAddress === polygonOwner) {
        return okAsync(latestPolygonNFTs);
      }
      return okAsync([]);
    });

    td.when(
      this.persistence.getAll(td.matchers.anything(), td.matchers.anything()),
    ).thenDo(() => {
      return okAsync(earnedRewards);
    });

    td.when(this.persistence.getAll(td.matchers.anything())).thenDo(
      (key: ERecordKey) => {
        if (key === ERecordKey.ACCOUNT) {
          return okAsync(linkedAccounts);
        }

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

  public factory(): INFTRepositoryWithDebug {
    return new NftRepository(
      this.contextProvider,
      this.configProvider,
      this.persistence,
      this.masterIndexer,
      this.timeUtils,
      this.logUtils,
      this.bigNumberUtils,
    );
  }
}

async function getOk<T, K>(
  result: Result<T, K> | ResultAsync<T, K>,
): Promise<T> {
  expect(result).toBeDefined();
  if (result instanceof Promise || result instanceof ResultAsync) {
    const awaitedResult = await result;
    expect(awaitedResult.isErr()).toBeFalsy();
    return awaitedResult._unsafeUnwrap();
  } else {
    expect(result.isErr()).toBeFalsy();
    return result._unsafeUnwrap();
  }
}

describe("NftRepository", () => {
  beforeEach(() => {
    currentTime = UnixTimestamp(1701779734);
    latestFujiNFTs = fujiNfts;
    latestPolygonNFTs = polygonNfts;
    persistenceMap.clear();
  });

  describe("storing and  transferring nfts ", () => {
    test("no benchmark given but accounts are linked and the cache is empty, will get all the nfts", async () => {
      // Arrange
      const mocks = new NftRepositoryMocks();
      const service = mocks.factory();

      //Act
      const result = await getOk(service.getNfts());
      expect(result).toEqual(expectedNfts);
    });

    test("benchmark given but filter is disabled, since cache does not exist will trigger indexers , will get all the nfts", async () => {
      // Arrange
      const mocks = new NftRepositoryMocks();
      const service = mocks.factory();

      //Act
      // Will trigger data, but the query is not qualified,
      // If filter was given, Only expectedShibuya will be returned, but it is disable for now
      const result = await getOk(service.getNfts(UnixTimestamp(1701779729)));

      expect(result).toEqual(expectedNfts);

      const resultCache = await getOk(service.getNFTCache());

      expect(resultCache.get(43113)?.lastUpdateTime).toEqual(1701779730);
    });

    test("benchmark given should get nfts from cache and return all wallet nfts with history", async () => {
      // Arrange
      const mocks = new NftRepositoryMocks();
      const service = mocks.factory();

      //Act
      const result = await getOk(service.getNfts(UnixTimestamp(1701779733)));
      expect(result).toEqual(expectedNfts);

      const resultCache = await getOk(service.getNFTCache());
      expect(resultCache.get(43113)?.lastUpdateTime).toEqual(1701779733);
    });

    test("nfts should be recorded on indexddb, with history ", async () => {
      // Arrange
      const mocks = new NftRepositoryMocks();
      const service = mocks.factory();

      // Will trigger data, but the query is not qualified, only shibuya will return
      await service.getNfts(UnixTimestamp(1701779729));

      const result = await getOk(service.getNFTsHistory());
      expect(result).toEqual(indexedNftInitialHistory);
      //Act

      const resultPersistenceNfts = await getOk(service.getPersistenceNFTs());
      expect(resultPersistenceNfts).toEqual(indexedNfts);
    });

    test("returns all nfts first, receive remove event, return single nft for fuji ", async () => {
      // Arrange
      const mocks = new NftRepositoryMocks();
      const service = mocks.factory();

      //Act
      //Trigger first call, should get all cache is set to 1701779732
      const result = await getOk(service.getNfts(UnixTimestamp(1701779732)));

      expect(result).toEqual(expectedNfts);

      const resultCache = await getOk(service.getNFTCache());
      expect(resultCache.get(43113)?.lastUpdateTime).toEqual(1701779732);

      // 2. call, same nfts returned no change
      await service.getNfts(UnixTimestamp(1701779733));
      //Act
      //3. call, 1 nft is missing (user transferred), will create a record for nft transfer
      latestFujiNFTs = latestFujiNFTs.slice(1);

      const result2 = await getOk(service.getNfts(UnixTimestamp(1701779737)));

      expect(result2).toEqual([
        ...expectedShibuya,
        ...expectedFujiNfts.slice(1),
        ...expectedPolygon,
      ]);

      const resultCache2 = await getOk(service.getNFTCache());
      expect(resultCache2.get(43113)?.lastUpdateTime).toEqual(1701779737);
      expect(resultCache2.get(137)?.lastUpdateTime).toEqual(1701779737);
    });

    test("nfts should be recorded on indexddb, with history, after transfer new record should be recorded", async () => {
      // Arrange
      const mocks = new NftRepositoryMocks();
      const service = mocks.factory();

      await service.getNfts(UnixTimestamp(1701779730));
      await service.getNfts(UnixTimestamp(1701779732));
      latestFujiNFTs = latestFujiNFTs.slice(1);
      await service.getNfts(UnixTimestamp(1701779737));
      //Act

      const result = await getOk(service.getNFTsHistory());

      expect(result).toEqual([
        ...indexedNftInitialHistory,
        indexedNftTransferlHistory[0],
      ]);

      const persistenceNft = await getOk(service.getPersistenceNFTs());
      expect(persistenceNft).toEqual(indexedNfts);
    });

    test("User transfers an existing nft, then gets it back, final result should reflect it ", async () => {
      // Arrange
      const mocks = new NftRepositoryMocks();
      const service = mocks.factory();

      //Act
      // initial call adds 2 nfts with 2 nft history with added record
      await service.getNfts(UnixTimestamp(1701779730));
      // 2. call, same nfts returned no change
      await service.getNfts(UnixTimestamp(1701779732));

      // 3. call, 1 nft is missing (user transferred), will create a record for nft transfer
      latestFujiNFTs = latestFujiNFTs.slice(1);
      const result = await getOk(
        await service.getNfts(UnixTimestamp(1701779737)),
      );

      expect(result).toEqual([
        ...expectedShibuya,
        ...expectedFujiNfts.slice(1),
        ...expectedPolygon,
      ]);

      const cache = await getOk(service.getNFTCache());
      expect(cache.get(43113)?.lastUpdateTime).toEqual(1701779737);
      expect(cache.get(137)?.lastUpdateTime).toEqual(1701779737);

      const history = await getOk(service.getNFTsHistory());
      expect(history).toEqual([
        ...indexedNftInitialHistory,
        indexedNftTransferlHistory[0],
      ]);

      // Final call, got the nft back
      latestFujiNFTs = [
        fujiIndexerResponseAfterRegainingTheNft,
        ...latestFujiNFTs,
      ];
      currentTime = UnixTimestamp(1701779738);

      const result2 = await getOk(service.getNfts(UnixTimestamp(1701779739)));

      expect(result2).toEqual([
        ...expectedShibuya,
        nftThatGotTransferredAndGotBack,
        ...expectedFujiNfts.slice(1),
        ...expectedPolygon,
      ]);

      const cache2 = await getOk(service.getNFTCache());
      expect(cache2.get(43113)?.lastUpdateTime).toEqual(1701779739);
      expect(cache2.get(137)?.lastUpdateTime).toEqual(1701779739);

      const history2 = await getOk(service.getNFTsHistory());
      expect(history2).toEqual([
        ...indexedNftInitialHistory,
        ...indexedNftTransferlHistory,
      ]);
    });

    test("User transferred nft but filter is disabled will get the old data  ", async () => {
      // Arrange
      const mocks = new NftRepositoryMocks();
      const service = mocks.factory();

      //Act
      // initial call adds 2 nfts with 2 nft history with added record
      await service.getNfts(UnixTimestamp(1701779734));
      // 2. call, same nfts returned no change
      await service.getNfts(UnixTimestamp(1701779736)); //

      // 3. call, 1 nft is missing (user transferred), will create a record for nft transfer
      latestFujiNFTs = latestFujiNFTs.slice(1);
      const result = await getOk(
        await service.getNfts(UnixTimestamp(1701779737)),
      );

      expect(result).toEqual([
        ...expectedShibuya,
        ...expectedFujiNfts.slice(1),
        ...expectedPolygon,
      ]);

      const cache = await getOk(service.getNFTCache());
      expect(cache.get(43113)?.lastUpdateTime).toEqual(1701779737);
      expect(cache.get(137)?.lastUpdateTime).toEqual(1701779737);

      const result2 = await getOk(service.getNfts(UnixTimestamp(1701779732)));
      expect(result2).toEqual([
        ...expectedShibuya,
        ...expectedFujiNfts.slice(1),
        ...expectedPolygon,
      ]);

      const cache2 = await getOk(service.getNFTCache());
      expect(cache2.get(43113)?.lastUpdateTime).toEqual(1701779737);
      expect(cache2.get(137)?.lastUpdateTime).toEqual(1701779737);
    });

    test("User transferred,  get the current nfts , filter is disabled  ", async () => {
      // Arrange
      const mocks = new NftRepositoryMocks();
      const service = mocks.factory();

      //Act
      // initial call adds 2 nfts with 2 nft history with added record
      await service.getNfts(UnixTimestamp(1701779734));
      // 2. call, same nfts returned no change
      await service.getNfts(UnixTimestamp(1701779736)); //

      // 3. call, 1 nft is missing (user transferred), will create a record for nft transfer
      latestFujiNFTs = latestFujiNFTs.slice(1);
      await service.getNfts(UnixTimestamp(1701779737));

      const result2 = await getOk(service.getNfts(UnixTimestamp(1701779732)));
      //Expected Nfts
      expect(result2).toEqual([
        ...expectedShibuya,
        ...expectedFujiNfts.slice(1),
        ...expectedPolygon,
      ]);

      const result3 = await getOk(service.getNfts(UnixTimestamp(1701779737)));

      expect(result3).toEqual([
        ...expectedShibuya,
        ...expectedFujiNfts.slice(1),
        ...expectedPolygon,
      ]);

      const cache2 = await getOk(service.getNFTCache());
      expect(cache2.get(43113)?.lastUpdateTime).toEqual(1701779737);
      expect(cache2.get(137)?.lastUpdateTime).toEqual(1701779737);
    });
  });
});
