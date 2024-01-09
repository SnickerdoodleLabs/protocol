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
} from "@snickerdoodlelabs/objects";
import { IPersistenceConfigProvider } from "@snickerdoodlelabs/persistence";
import { BigNumber } from "ethers";
import { okAsync } from "neverthrow";
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
  indexerNft,
  expectedShibuya,
  expectedFujiNfts,
  expectedPolygon,
  indexedNftTransferlHistory,
} from "@core-tests/mock/mocks/commonValues";
import { ContextProviderMock } from "@core-tests/mock/utilities/ContextProviderMock";
import { ConfigProviderMock } from "@core-tests/mock/utilities/index.js";

const persistenceMap = new Map<
  ERecordKey,
  Map<string, Record<string, unknown>>
>([]);
let indexTime = 0;
let indexIndexer = 0;
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

    td.when(this.timeUtils.getUnixNow()).thenDo(() => {
      indexTime++;
      if (indexTime < 10) {
        return UnixTimestamp(1701779734);
      }
      //User got the nft back
      return UnixTimestamp(1701779738);
    });

    td.when(
      this.masterIndexer.getSupportedChains(EIndexerMethod.NFTs),
    ).thenReturn(okAsync([43113, 137]));

    td.when(this.bigNumberUtils.BNSToBN(td.matchers.anything())).thenDo(
      (bigNumberString: BigNumberString) => {
        return BigNumber.from(bigNumberString);
      },
    );

    td.when(this.bigNumberUtils.BNToBNS(td.matchers.anything())).thenDo(
      (bigNumber: BigNumber) => {
        return BigNumberString(BigNumber.from(bigNumber).toString());
      },
    );

    td.when(
      this.masterIndexer.getLatestNFTs(
        td.matchers.anything(),
        td.matchers.anything(),
      ),
    ).thenDo((chain: number, accountAddress: EVMAccountAddress) => {
      indexIndexer++;
      return okAsync(indexerNft(chain, accountAddress, indexIndexer));
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

describe("NftRepository", () => {
  beforeEach(() => {
    indexTime = 0;
    indexIndexer = 0;
    persistenceMap.clear();
  });

  describe("storing and  transferring nfts ", () => {
    test("no benchmark given should only shibuya nft since db is not populated", async () => {
      // Arrange
      const mocks = new NftRepositoryMocks();
      const service = mocks.factory();

      //Act
      await service
        .getNfts()
        .andThen((result) => {
          expect(result).toEqual(expectedShibuya);
          return okAsync(undefined);
        })
        .mapErr((e) => {
          console.log(e);
          expect(1).toBe(2);
        });
    });

    test("benchmark given, since cache does not exist will trigger indexers but the dates are later than the benchmark, will not return the new data", async () => {
      // Arrange
      const mocks = new NftRepositoryMocks();
      const service = mocks.factory();

      //Act
      // Will trigger data, but the query is not qualified, only shibuya will return
      await service
        .getNfts(UnixTimestamp(1701779729))
        .andThen((result) => {
          const shibuyaResult = expectedNfts.slice(0, 1);
          expect(result).toEqual(shibuyaResult);
          return service.getNFTCache().andThen((cache) => {
            // Timestamp from indexer
            expect(cache.get(43113)?.lastUpdateTime).toEqual(1701779730);
            return okAsync(undefined);
          });
        })
        .mapErr((e) => {
          console.log(e);
          expect(1).toBe(2);
        });
    });

    test("benchmark given should get nfts from cache and return all wallet nfts with history", async () => {
      // Arrange
      const mocks = new NftRepositoryMocks();
      const service = mocks.factory();

      //Act
      await service
        .getNfts(UnixTimestamp(1701779734))
        .andThen((result) => {
          expect(result).toEqual(expectedNfts);
          return service.getNFTCache().andThen((cache) => {
            expect(cache.get(43113)?.lastUpdateTime).toEqual(1701779734);
            return okAsync(undefined);
          });
        })
        .mapErr((e) => {
          console.log(e);
          expect(1).toBe(2);
        });
    });

    test("nfts should be recorded on indexddb, with history ", async () => {
      // Arrange
      const mocks = new NftRepositoryMocks();
      const service = mocks.factory();

      // Will trigger data, but the query is not qualified, only shibuya will return
      await service.getNfts(UnixTimestamp(1701779729));

      //Act
      await service
        .getNFTsHistory()
        .andThen((nftHistories) => {
          expect(nftHistories).toEqual(indexedNftInitialHistory);
          return okAsync(undefined);
        })
        .mapErr((e) => {
          console.log(e);
          expect(1).toBe(2);
        });

      await service
        .getPersistenceNFTs()
        .andThen((nfts) => {
          expect(nfts).toEqual(indexedNfts);
          return okAsync(undefined);
        })
        .mapErr((e) => {
          console.log(e);
          expect(1).toBe(2);
        });
    });

    test("returns all nfts first, receive remove event, return single nft for fuji ", async () => {
      // Arrange
      const mocks = new NftRepositoryMocks();
      const service = mocks.factory();

      //Act
      //Trigger first call, should get all cache is set to 1701779734
      await service
        .getNfts(UnixTimestamp(1701779734))
        .andThen((result) => {
          expect(result).toEqual(expectedNfts);
          return service.getNFTCache().andThen((cache) => {
            expect(cache.get(43113)?.lastUpdateTime).toEqual(1701779734);
            return okAsync(undefined);
          });
        })
        .mapErr((e) => {
          console.log(e);
          expect(1).toBe(2);
        });

      // 2. call, same nfts returned no change
      await service.getNfts(UnixTimestamp(1701779736));
      //Act
      //3. call, 1 nft is missing (user transferred), will create a record for nft transfer
      await service
        .getNfts(UnixTimestamp(1701779737))
        .andThen((result) => {
          expect(result).toEqual([
            ...expectedShibuya,
            ...expectedFujiNfts.slice(1),
            ...expectedPolygon,
          ]);
          return service.getNFTCache().andThen((cache) => {
            //Cache updated

            expect(cache.get(43113)?.lastUpdateTime).toEqual(1701779737);
            expect(cache.get(137)?.lastUpdateTime).toEqual(1701779737);
            return okAsync(undefined);
          });

          //
        })
        .mapErr((e) => {
          console.log(e);
          expect(1).toBe(2);
        });
    });

    test("nfts should be recorded on indexddb, with history, after transfer new record should be recorded", async () => {
      // Arrange
      const mocks = new NftRepositoryMocks();
      const service = mocks.factory();

      //Act
      await service.getNfts(UnixTimestamp(1701779734));
      await service.getNfts(UnixTimestamp(1701779736));
      await service.getNfts(UnixTimestamp(1701779737));
      //Act
      await service
        .getNFTsHistory()
        .andThen((nftHistories) => {
          expect(nftHistories).toEqual([
            ...indexedNftInitialHistory,
            indexedNftTransferlHistory[0],
          ]);
          return okAsync(undefined);
        })
        .mapErr((e) => {
          console.log(e);
          expect(1).toBe(2);
        });

      await service
        .getPersistenceNFTs()
        .andThen((nfts) => {
          expect(nfts).toEqual(indexedNfts);
          return okAsync(undefined);
        })
        .mapErr((e) => {
          console.log(e);
          expect(1).toBe(2);
        });
    });

    test("User transfers an existing nft, then gets it back, final result should reflect it ", async () => {
      // Arrange
      const mocks = new NftRepositoryMocks();
      const service = mocks.factory();

      //Act
      // initial call adds 2 nfts with 2 nft history with added record
      await service.getNfts(UnixTimestamp(1701779734));
      // 2. call, same nfts returned no change
      await service.getNfts(UnixTimestamp(1701779736));

      // 3. call, 1 nft is missing (user transferred), will create a record for nft transfer
      await service
        .getNfts(UnixTimestamp(1701779737))
        .andThen((result) => {
          expect(result).toEqual([
            ...expectedShibuya,
            ...expectedFujiNfts.slice(1),
            ...expectedPolygon,
          ]);
          return service.getNFTCache().andThen((cache) => {
            //Cache updated
            expect(cache.get(43113)?.lastUpdateTime).toEqual(1701779737);
            expect(cache.get(137)?.lastUpdateTime).toEqual(1701779737);
            return okAsync(undefined);
          });
        })
        .mapErr((e) => {
          console.log(e);
          expect(1).toBe(2);
        });

      await service
        .getNFTsHistory()
        .andThen((nftHistories) => {
          expect(nftHistories).toEqual([
            ...indexedNftInitialHistory,
            indexedNftTransferlHistory[0],
          ]);
          return okAsync(undefined);
        })
        .mapErr((e) => {
          console.log(e);
          expect(1).toBe(2);
        });

      // Final call, got the nft back
      await service
        .getNfts(UnixTimestamp(1701779739))
        .andThen((result) => {
          expect(result).toEqual([
            ...expectedShibuya,
            nftThatGotTransferredAndGotBack,
            ...expectedFujiNfts.slice(1),
            ...expectedPolygon,
          ]);
          return service.getNFTCache().andThen((cache) => {
            //Cache updated
            expect(cache.get(43113)?.lastUpdateTime).toEqual(1701779739);
            expect(cache.get(137)?.lastUpdateTime).toEqual(1701779739);
            return okAsync(undefined);
          });
        })
        .mapErr((e) => {
          console.log(e);
          expect(1).toBe(2);
        });

      await service
        .getNFTsHistory()
        .andThen((nftHistories) => {
          expect(nftHistories).toEqual([
            ...indexedNftInitialHistory,
            ...indexedNftTransferlHistory,
          ]);
          return okAsync(undefined);
        })
        .mapErr((e) => {
          console.log(e);
          expect(1).toBe(2);
        });
    });

    test("User transferred nft but benchmark transfer date should get all the nfts  ", async () => {
      // Arrange
      const mocks = new NftRepositoryMocks();
      const service = mocks.factory();

      //Act
      // initial call adds 2 nfts with 2 nft history with added record
      await service.getNfts(UnixTimestamp(1701779734));
      // 2. call, same nfts returned no change
      await service.getNfts(UnixTimestamp(1701779736)); //

      // 3. call, 1 nft is missing (user transferred), will create a record for nft transfer
      await service
        .getNfts(UnixTimestamp(1701779737))
        .andThen((result) => {
          expect(result).toEqual([
            ...expectedShibuya,
            ...expectedFujiNfts.slice(1),
            ...expectedPolygon,
          ]);
          return service.getNFTCache().andThen((cache) => {
            //Cache updated
            expect(cache.get(43113)?.lastUpdateTime).toEqual(1701779737);
            expect(cache.get(137)?.lastUpdateTime).toEqual(1701779737);
            return okAsync(undefined);
          });
        })
        .mapErr((e) => {
          console.log(e);
          expect(1).toBe(2);
        });

      await service
        .getNfts(UnixTimestamp(1701779732))
        .andThen((result) => {
          // Latest data returns 2 nft but this will return an earlier snapshot where all 3 where valid
          expect(result).toEqual(expectedNfts);
          return service.getNFTCache().andThen((cache) => {
            //Cache updated
            expect(cache.get(43113)?.lastUpdateTime).toEqual(1701779737);
            expect(cache.get(137)?.lastUpdateTime).toEqual(1701779737);
            return okAsync(undefined);
          });
        })
        .mapErr((e) => {
          console.log(e);
          expect(1).toBe(2);
        });
    });
  });
});
