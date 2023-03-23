import {
  EligibleAd,
  PersistenceError,
  EBackupPriority,
  AdSignature,
  VolatileStorageMetadata,
  ERecordKey,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IAdDataRepository,
  IDataWalletPersistence,
  IDataWalletPersistenceType,
} from "@core/interfaces/data/index.js";

@injectable()
export class AdDataRepository implements IAdDataRepository {
  public constructor(
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
  ) {}

  public saveEligibleAds(
    ads: EligibleAd[],
  ): ResultAsync<void, PersistenceError> {
    return ResultUtils.combine(
      ads.map((ad) => {
        return this.persistence.updateRecord(
          ERecordKey.ELIGIBLE_ADS,
          new VolatileStorageMetadata<EligibleAd>(ad),
        );
      }),
    ).map(() => {});
  }

  public getEligibleAds(): ResultAsync<EligibleAd[], PersistenceError> {
    return this.persistence.getAll<EligibleAd>(ERecordKey.ELIGIBLE_ADS);
  }

  public saveAdSignatures(
    adSigList: AdSignature[],
  ): ResultAsync<void, PersistenceError> {
    return ResultUtils.combine(
      adSigList.map((adSig) => {
        return this.persistence.updateRecord(
          ERecordKey.AD_SIGNATURES,
          new VolatileStorageMetadata<AdSignature>(adSig),
        );
      }),
    ).map(() => undefined);
  }

  public getAdSignatures(): ResultAsync<AdSignature[], PersistenceError> {
    return this.persistence.getAll<AdSignature>(ERecordKey.AD_SIGNATURES);
  }
}
