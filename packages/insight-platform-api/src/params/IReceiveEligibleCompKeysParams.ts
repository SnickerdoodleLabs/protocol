import {
  EVMContractAddress,
  IpfsCID,
  QueryIdentifier,
  Signature,
} from "@snickerdoodlelabs/objects";

export interface IReceiveEligibleCompKeysParams {
  consentContractId: EVMContractAddress;
  queryCID: IpfsCID;
  tokenId: string;
  queries: QueryIdentifier[];
  signature: Signature;
}
