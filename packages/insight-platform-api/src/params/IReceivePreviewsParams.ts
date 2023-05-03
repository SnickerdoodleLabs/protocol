import {
  EVMContractAddress,
  IpfsCID,
  SubQueryKey,
  Signature,
} from "@snickerdoodlelabs/objects";

export interface IReceivePreviewsParams {
  consentContractId: EVMContractAddress;
  queryCID: IpfsCID;
  tokenId: string;
  queries: SubQueryKey[];
  signature: Signature;
}
