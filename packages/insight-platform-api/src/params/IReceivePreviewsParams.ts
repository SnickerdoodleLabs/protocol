import {
  EVMContractAddress,
  IpfsCID,
  QueryIdentifier,
  Signature,
} from "@snickerdoodlelabs/objects";

export interface IReceivePreviewsParams {
  consentContractId: EVMContractAddress;
  queryCID: IpfsCID;
  tokenId: string;
  queries: QueryIdentifier[];
  signature: Signature;
}
