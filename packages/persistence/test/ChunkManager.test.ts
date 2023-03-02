import "reflect-metadata";

import {
  AdContent,
  EAdContentType,
  EligibleAd,
  EAdDisplayType,
  EVMPrivateKey,
  IpfsCID,
  UnixTimestamp,
  AdKey,
  EVMContractAddress,
  EBackupPriority,
  VolatileStorageMetadata,
} from "@snickerdoodlelabs/objects";

import { ERecordKey } from "@persistence/ELocalStorageKey";
import { BackupManagerProviderMocks } from "@persistence-test/mocks";

class ChunkManagerMocks {
  public networkQueryEvaluator = new NetworkQueryEvaluator(
    this.transactionRepo,
  );
  public demoDataRepo = td.object<IDemographicDataRepository>();
  public browsingDataRepo = td.object<IBrowsingDataRepository>();

  public constructor() {
    this.queryObjectFactory = new QueryObjectFactory();

    const expectedCompensationsMap = new Map<
      CompensationId,
      ISDQLCompensations
    >();
  }

  public factory() {
    return new QueryParsingEngine(
      this.queryFactories,
      this.queryRepository,
      this.queryUtils,
      this.adContentRepository,
      this.adDataRepo,
    );
  }
}
