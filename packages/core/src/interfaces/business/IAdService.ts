import {
  AdSignature,
  EligibleAd,
  IPFSError,
  PersistenceError,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IAdService {
  requestDisplay(ad: EligibleAd): ResultAsync<boolean, PersistenceError>;

  onAdDisplayed(
    eligibleAd: EligibleAd,
  ): ResultAsync<void, UninitializedError | IPFSError | PersistenceError>;
}

export const IAdServiceType = Symbol.for("IAdService");
