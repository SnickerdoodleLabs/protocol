import { AdKey, AdSignatureWrapper, EligibleAd, IpfsCID, PersistenceError, SHA256Hash } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
  
export interface IAdService {

  // To be used by Query Parsing Engine
  saveEligibleAds(ads: EligibleAd[]): ResultAsync<void, PersistenceError>;

  // getAdSignatures(queryCID) returns a list of signatures.

  // A set of functions to display and track ad engagement
  getEligibleAds(): ResultAsync<EligibleAd[], PersistenceError>;
  requestDisplay(ad: EligibleAd): ResultAsync<boolean, PersistenceError>;

  // event subscriptions
  // onAdDisplayed(queryCID, adId, contentHash)
  
  createAdSignature(
    queryCID: IpfsCID, 
    adKey: AdKey, 
    contentHash: SHA256Hash
  ): ResultAsync<AdSignatureWrapper, PersistenceError>;
  saveAdSignatures(
    adSignatureWrapperList: AdSignatureWrapper[]
  ): ResultAsync<void, PersistenceError>;
}
  
export const IAdServiceType = Symbol.for("IAdService");
