import {
  BigNumberString,
  EVMContractAddress,
  IpfsCID,
  JSONString,
  ZKProof,
} from "@snickerdoodlelabs/objects";

export interface IDeliverInsightsParams {
  consentContractId: EVMContractAddress;
  queryCID: IpfsCID;
  insights: JSONString;
  rewardParameters: JSONString;
  signalNullifier: BigNumberString;
  anonymitySetStart: number;
  anonymitySetSize: number;
  proof: ZKProof;
}
