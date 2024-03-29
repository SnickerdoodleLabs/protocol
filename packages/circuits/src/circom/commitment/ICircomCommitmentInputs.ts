import { CircuitSignals, groth16 } from "snarkjs";

export interface ICircomCommitmentInputs extends CircuitSignals {
  identityTrapdoor: bigint;
  identityNullifier: bigint;
  message: bigint;
}
