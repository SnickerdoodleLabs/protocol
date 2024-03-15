import {
  BigNumberString,
  EVMContractAddress,
  Signature,
  ZKProof,
} from "@snickerdoodlelabs/objects";

export interface IOptinParams {
  consentContractId: EVMContractAddress;
  commitment: BigNumberString;
  proof: ZKProof;
}

export interface IPrivateOptinParams extends IOptinParams {
  nonce: string;
  signature: Signature;
}
