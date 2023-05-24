import {
  EVMContractAddress,
  IpfsCID,
  SubQueryKey,
  Signature,
  AdKey,
  InsightKey,
} from "@snickerdoodlelabs/objects";

export interface IReceivePreviewsParams {
  consentContractId: EVMContractAddress;
  queryCID: IpfsCID;
  tokenId: string;
  possibleInsightsAndAds: (InsightKey | AdKey)[];
  signature: Signature;
}
