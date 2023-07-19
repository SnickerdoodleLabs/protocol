import {
  EVMContractAddress,
  IDynamicRewardParameter,
  IpfsCID,
  IQueryDeliveryItems,
  Signature,
} from "@snickerdoodlelabs/objects";

export interface IDeliverInsightsParams {
  consentContractId: EVMContractAddress;
  tokenId: string;
  queryCID: IpfsCID;
  insights: IQueryDeliveryItems;
  rewardParameters: IDynamicRewardParameter[];
  signature: Signature;
}
