import {
  EligibleAd,
  PersistenceError,
  AdSignature,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IAdDataRepository {
  saveEligibleAds(ads: EligibleAd[]): ResultAsync<void, PersistenceError>;
  getEligibleAds(): ResultAsync<EligibleAd[], PersistenceError>;

  saveAdSignatures(
    signatures: AdSignature[],
  ): ResultAsync<void, PersistenceError>;
  getAdSignatures(): ResultAsync<AdSignature[], PersistenceError>;
}

export const IAdDataRepositoryType = Symbol.for("IAdDataRepository");
