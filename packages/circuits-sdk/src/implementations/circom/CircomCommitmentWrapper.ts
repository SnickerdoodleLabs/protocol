import {
  CircomUtils,
  ICircomCommitmentInputs,
  commitmentCode,
  commitmentZKey,
} from "@snickerdoodlelabs/circuits";
import {
  BigNumberString,
  Commitment,
  ZKProof,
  CircuitError,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { CircomWrapper } from "@circuits-sdk/implementations/circom/CircomWrapper.js";
import { ICommitmentWrapper } from "@circuits-sdk/interfaces/index.js";

@injectable()
export class CircomCommitmentWrapper
  extends CircomWrapper<ICircomCommitmentInputs>
  implements ICommitmentWrapper
{
  public constructor() {
    super(commitmentCode, commitmentZKey);
  }

  public prove(
    signal: string,
    identityTrapdoor: BigNumberString,
    identityNullifier: BigNumberString,
  ): ResultAsync<ZKProof, CircuitError> {
    const signalHash = CircomUtils.stringToPoseidonHash(signal);

    const INPUT: ICircomCommitmentInputs = {
      identityTrapdoor: BigInt(identityTrapdoor),
      identityNullifier: BigInt(identityNullifier),
      message: signalHash,
    };

    return this._prove(INPUT);
  }

  public verify(
    signal: string,
    commitment: Commitment,
    proof: ZKProof,
  ): ResultAsync<boolean, CircuitError> {
    throw new Error("Method not implemented.");
  }
}
