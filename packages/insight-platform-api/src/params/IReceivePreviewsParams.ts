import {
  EVMContractAddress,
  IpfsCID,
  Signature,
  IQueryDeliveryItems,
} from "@snickerdoodlelabs/objects";

export interface IReceivePreviewsParams {
  consentContractId: EVMContractAddress;
  queryCID: IpfsCID;
  tokenId: string;
  queryDeliveryItems: IQueryDeliveryItems;
  signature: Signature;
}
