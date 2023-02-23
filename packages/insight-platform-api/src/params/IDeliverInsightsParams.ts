import {
  EVMContractAddress,
  IDynamicRewardParameter,
  IInsights,
  IpfsCID,
  Signature,
} from "@snickerdoodlelabs/objects";

export interface IDeliverInsightsParams {
  consentContractId: EVMContractAddress;
  tokenId: string;
  queryCID: IpfsCID;
  returns: IInsights;
  rewardParameters: IDynamicRewardParameter[];
  signature: Signature;
}
