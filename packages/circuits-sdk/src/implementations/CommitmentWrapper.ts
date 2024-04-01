/* import {
  commitmentVerification,
  CommitmentVerifyParams,
  Identity,
} from "@snickerdoodlelabs/circuits";
import {
  BigNumberString,
  CircuitError,
  ZKProof,
  Commitment as CommitmentBrand,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { Encoding, Field, Poseidon, Proof } from "o1js";

import { ZkProgramWrapper } from "@circuits-sdk/implementations/ZkProgramWrapper.js";
import { ICommitmentWrapper } from "@circuits-sdk/interfaces/ICommitmentWrapper.js";

@injectable()
export class CommitmentWrapper
  extends ZkProgramWrapper
  implements ICommitmentWrapper
{
  public constructor() {
    super(commitmentVerification);
  }
  static getIdentity(
    identityTrapdoor: BigNumberString,
    identityNullifier: BigNumberString,
  ): Identity {
    return new Identity({
      identityTrapdoor: new Field(BigInt(identityTrapdoor)),
      identityNullifier: new Field(BigInt(identityNullifier)),
    });
  }

  static getIdentityCommitment(identity: Identity): CommitmentBrand {
    return CommitmentBrand(identity.leaf().toBigInt());
  }

  public prove(
    signal: string,
    identityTrapdoor: BigNumberString,
    identityNullifier: BigNumberString,
  ): ResultAsync<ZKProof, CircuitError> {
    const signalFields = Encoding.stringToFields(signal);

    // NOTE: verifier should compute these quantities for themselves upon receiving the signal string
    const signalHash = Poseidon.hash([...signalFields]);
    const signalHashSquared = signalHash.mul(signalHash);

    // Create an identity object
    const identity = CommitmentWrapper.getIdentity(
      identityTrapdoor,
      identityNullifier,
    );

    const commitmentParams = new CommitmentVerifyParams({
      commitmentLeaf: identity.leaf(),
      signalHash: signalHash,
      signalHashSquared: signalHashSquared,
    });

    return this.assureCompile()

      .andThen(() => {
        return ResultAsync.fromPromise(
          commitmentVerification.commitmentVerify(
            commitmentParams,
            identity,
          ) as Promise<Proof<CommitmentVerifyParams, void>>,
          (e) => {
            return new CircuitError("Failed to generate proof", e);
          },
        );
      })
      .map((proof) => {
        const serializedProof = proof.toJSON();
        return ZKProof(serializedProof.proof);
      });
  }

  public verify(
    signal: string,
    commitment: CommitmentBrand,
    proof: ZKProof,
  ): ResultAsync<boolean, CircuitError> {
    const signalFields = Encoding.stringToFields(signal);

    const signalHash = Poseidon.hash(signalFields);
    const signalHashSquared = signalHash.mul(signalHash);

    return this._verify(
      [
        commitment.toString(),
        signalHash.toString(),
        signalHashSquared.toString(),
      ],
      proof,
    );
  }
}
 */
