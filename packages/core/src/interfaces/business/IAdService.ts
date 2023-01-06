import { EligibleAd, PersistenceError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
  
export interface IAdService {

  getEligibleAds(): ResultAsync<EligibleAd[], PersistenceError>;
  addEligibleAds(ads: EligibleAd[]): ResultAsync<void, PersistenceError>;

  // requestDisplay(ad: EligibleAd): ResultAsync<boolean, PersistenceError>;

  // onAdDisplayed()
}
  
export const IAdServiceType = Symbol.for("IAdService");
