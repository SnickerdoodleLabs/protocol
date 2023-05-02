import {
  EVMContractAddress,
  IpfsCID,
  SubqueryKey,
  Signature,
} from "@snickerdoodlelabs/objects";

export interface IReceivePreviewsParams {
  consentContractId: EVMContractAddress;
  queryCID: IpfsCID;
  tokenId: string;
  queries: SubqueryKey[];
  signature: Signature;
}
