import { CircuitSignals } from "snarkjs";

export interface ICircomSemaphoreInputs extends CircuitSignals {
  identityTrapdoor: bigint;
  identityNullifier: bigint;
  merkleProofLength: bigint;
  merkleProofIndices: bigint;
  merkleProofSiblings: bigint;
  scope: bigint;
  message: bigint;
}
