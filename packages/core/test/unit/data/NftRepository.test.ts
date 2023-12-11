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
  indexedNftHistory,
  indexedNfts,
  linkedAccounts,
  Nfts,
  walletNftWithHistory,
} from "@core-tests/mock/mocks/commonValues";
import { ContextProviderMock } from "@core-tests/mock/utilities/ContextProviderMock";
import { ConfigProviderMock } from "@core-tests/mock/utilities/index.js";

const persistenceMap = new Map<
  ERecordKey,
  Map<string, Record<string, unknown>>
>();
let index = 1;
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
      if (index < 2) {
        index++;
        return UnixTimestamp(1701779730);
      }
      return UnixTimestamp(1701779734);
    });

    td.when(this.accountRepo.getAccounts()).thenReturn(okAsync(linkedAccounts));
    td.when(
      this.masterIndexer.getSupportedChains(EIndexerMethod.NFTs),
    ).thenReturn(okAsync([43114]));

    td.when(
      this.masterIndexer.getLatestNFTs(
        43114,
        linkedAccounts[0].sourceAccountAddress,
      ),
    ).thenReturn(okAsync(Nfts));

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
    index = 1;
    persistenceMap.clear();
  });
  test("should return cached NFTs", async () => {
    // Arrange
    const mocks = new NftRepositoryMocks();
    const service = mocks.factory();

    //Act
    await service.getCachedNFTs().map((cachedResult) => {
      const nftHistoryStored: Record<string, unknown>[] = [
        ...persistenceMap.get(ERecordKey.NFTS_HISTORY)!.values(),
      ];
      const nftStored: Record<string, unknown>[] = [
        ...persistenceMap.get(ERecordKey.NFTS)!.values(),
      ];

      expect(cachedResult).toEqual(cachedNfts);
      expect(nftHistoryStored).toEqual(indexedNftHistory);
      expect(nftStored).toEqual(indexedNfts);
    });
  });

  test("should return both NFTs that are measured before the benchmark", async () => {
    // Arrange
    const mocks = new NftRepositoryMocks();
    const service = mocks.factory();

    //Act
    await service.getCachedNFTs(UnixTimestamp(1701779735)).map((result) => {
      expect(result).toEqual(walletNftWithHistory);
    });
  });

  test("should return only the first cached NFT that is measured before the benchmark", async () => {
    // Arrange
    const mocks = new NftRepositoryMocks();
    const service = mocks.factory();
    const [validNftWithHistory] = walletNftWithHistory;
    //Act
    await service.getCachedNFTs(UnixTimestamp(1701779733)).map((result) => {
      expect(result).toEqual([validNftWithHistory]);
    });
  });
});
