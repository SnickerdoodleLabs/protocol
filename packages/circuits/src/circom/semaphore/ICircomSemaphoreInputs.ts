import { CircuitSignals } from "snarkjs";

import { CircomUtils } from "../CircomUtils";

export interface ICircomSemaphoreInputs extends CircuitSignals {
  identityTrapdoor: bigint;
  identityNullifier: bigint;
  merkleProofLength: number;
  merkleProofIndices: number[];
  merkleProofSiblings: bigint[];
  scope: bigint;
  message: bigint;
}

export function factoryCircomSemaphoreVerificationInputs(
  merkleRoot: bigint,
  nullifier: bigint,
  message: string,
): ICircomSemaphoreVerificationInputs {
  const messageHash = CircomUtils.stringToPoseidonHash(message);
  const messageSquare = CircomUtils.moduloMultiply(messageHash, messageHash);
  return [
    merkleRoot.toString(),
    nullifier.toString(),
    messageSquare.toString(),
  ];
}
export type ICircomSemaphoreVerificationInputs = [string, string, string];
