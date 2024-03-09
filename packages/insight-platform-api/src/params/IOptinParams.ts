import {
  Commitment,
  EVMContractAddress,
  Signature,
  ZKProof,
} from "@snickerdoodlelabs/objects";

export interface IOptinParams {
  consentContractId: EVMContractAddress;
  commitment: Commitment;
  proof: ZKProof;
}

export interface IPrivateOptinParams extends IOptinParams {
  nonce: string;
  signature: Signature;
}
