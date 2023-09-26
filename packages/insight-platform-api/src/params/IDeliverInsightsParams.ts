import {
  EVMContractAddress,
  IDynamicRewardParameter,
  IpfsCID,
  IQueryDeliveryItems,
  ISO8601DateString,
  Signature,
} from "@snickerdoodlelabs/objects";

export interface IDeliverInsightsParams {
  consentContractId: EVMContractAddress;
  tokenId: string;
  queryCID: IpfsCID;
  insights: IQueryDeliveryItems;
  rewardParameters: IDynamicRewardParameter[];
  responseTime : ISO8601DateString
  signature: Signature;
}
