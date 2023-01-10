import { AdKey, AdSignature, EligibleAd, EVMAccountAddress, InvalidSignatureError, IpfsCID, IPFSError, PersistenceError, SHA256Hash } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
  
export interface IAdService {

  // To be used by Query Parsing Engine
  saveEligibleAds(
    ads: EligibleAd[]
  ): ResultAsync<void, PersistenceError>;

  // A set of functions to display and track ad engagement
  getEligibleAds(): ResultAsync<EligibleAd[], PersistenceError>;
  getAdSignatures(): ResultAsync<AdSignature[], PersistenceError>;

  createAdSignature(
    eligibleAd: EligibleAd
  ): ResultAsync<AdSignature, Error>;
  getHashedAdContentByIpfsCID(
    cid: IpfsCID
  ): ResultAsync<SHA256Hash, IPFSError>;
  saveAdSignatures(
    adSigList: AdSignature[]
  ): ResultAsync<void, PersistenceError>;

  requestDisplay(
    ad: EligibleAd
  ): ResultAsync<boolean, PersistenceError>;

  // event subscriptions
  onAdDisplayed(
    queryCID: IpfsCID, 
    adKey: AdKey, 
    contentHash: SHA256Hash
  ): ResultAsync<void, Error>;
}
  
export const IAdServiceType = Symbol.for("IAdService");
