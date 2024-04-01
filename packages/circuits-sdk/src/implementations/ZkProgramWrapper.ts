/* import { CircuitError, ZKProof } from "@snickerdoodlelabs/objects";
import { injectable, unmanaged } from "inversify";
import { ResultAsync } from "neverthrow";
import { Field, JsonProof, verify } from "o1js";

type ZkProgram = {
  compile(): Promise<{
    verificationKey: VerificationKey;
  }>;
  name: string;
};

type VerificationKey = {
  hash: Field;
  data: string;
};

@injectable()
export abstract class ZkProgramWrapper {
  public constructor(@unmanaged() protected program: ZkProgram) {}

  protected verificationKeyResult: ResultAsync<
    VerificationKey,
    CircuitError
  > | null = null;

  protected assureCompile(): ResultAsync<VerificationKey, CircuitError> {
    if (this.verificationKeyResult == null) {
      this.verificationKeyResult = ResultAsync.fromPromise(
        this.program.compile(),
        (error) => {
          return new CircuitError(
            `Failed to generate keypair for ${this.program.name}`,
            error,
          );
        },
      ).map((val) => {
        return val.verificationKey;
      });
    }
    return this.verificationKeyResult;
  }

  protected _verify(
    publicInput: string[],
    proof: ZKProof,
  ): ResultAsync<boolean, CircuitError> {
    const reconstitutedProof = {
      publicInput,
      publicOutput: [],
      proof,
      maxProofsVerified: 0,
    } as JsonProof;

    return this.assureCompile().andThen((verificationKey) => {
      return ResultAsync.fromPromise(
        verify(reconstitutedProof, verificationKey) as Promise<boolean>,
        (error) => {
          return new CircuitError("Failed to verify proof", error);
        },
      );
    });
  }
}
 */
