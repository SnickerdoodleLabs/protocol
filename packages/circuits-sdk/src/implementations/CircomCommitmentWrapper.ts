import {
  CircomUtils,
  ICircomCommitmentInputs,
  ICircomCommitmentVerificationInputs,
  commitmentCode,
  commitmentVerificationKey,
  commitmentZKey,
  factoryCircomCommitmentVerificationInputs,
} from "@snickerdoodlelabs/circuits";
import {
  Commitment,
  ZKProof,
  CircuitError,
  NullifierBNS,
  TrapdoorBNS,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { CircomWrapper } from "@circuits-sdk/implementations/CircomWrapper.js";
import { ICommitmentWrapper } from "@circuits-sdk/interfaces/index.js";

@injectable()
export class CircomCommitmentWrapper
  extends CircomWrapper<
    ICircomCommitmentInputs,
    ICircomCommitmentVerificationInputs
  >
  implements ICommitmentWrapper
{
  public constructor() {
    super(commitmentCode, commitmentZKey, commitmentVerificationKey);
  }

  public prove(
    signal: string,
    identityTrapdoor: TrapdoorBNS,
    identityNullifier: NullifierBNS,
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
    const inputs = factoryCircomCommitmentVerificationInputs(
      commitment,
      signal,
    );
    return this._verify(proof, inputs);
  }
}
