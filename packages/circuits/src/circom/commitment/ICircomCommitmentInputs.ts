import { Commitment } from "@snickerdoodlelabs/objects";
import { CircuitSignals } from "snarkjs";

import { CircomUtils } from "@circuits/circom/CircomUtils.js";

export interface ICircomCommitmentInputs extends CircuitSignals {
  identityTrapdoor: bigint;
  identityNullifier: bigint;
  message: bigint;
}

export function factoryCircomCommitmentVerificationInputs(
  commitment: Commitment,
  message: string,
): ICircomCommitmentVerificationInputs {
  const messageHash = CircomUtils.stringToPoseidonHash(message);
  const messageSquare = CircomUtils.moduloMultiply(messageHash, messageHash);
  return [commitment.toString(), messageSquare.toString()];
}
export type ICircomCommitmentVerificationInputs = [string, string];
