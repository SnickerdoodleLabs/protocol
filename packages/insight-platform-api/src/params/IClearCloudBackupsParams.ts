import { EVMAccountAddress, Signature } from "@snickerdoodlelabs/objects";

export interface IClearCloudBackupsParams {
  walletAddress: EVMAccountAddress;
  signature: Signature;
}
