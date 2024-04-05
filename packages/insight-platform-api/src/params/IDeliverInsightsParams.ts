import {
  EVMContractAddress,
  IpfsCID,
  JSONString,
  NullifierBNS,
  ZKProof,
} from "@snickerdoodlelabs/objects";

export interface IDeliverInsightsParams {
  consentContractId: EVMContractAddress;
  queryCID: IpfsCID;
  insights: JSONString;
  rewardParameters: JSONString;
  signalNullifier: NullifierBNS;
  anonymitySetStart: number;
  anonymitySetSize: number;
  proof: ZKProof;
}
