import { ObjectUtils } from "@snickerdoodlelabs/common-utils";
import { CircuitError, JSONString, ZKProof } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { Circuit, Keypair } from "o1js";
// This import is annoying, but noted. Only way to get this specific Proof class outside o1js
import { Proof, VerificationKey } from "o1js/dist/node/lib/circuit";

// This is a handy way to say, I'm passing in a class as a whole, and the class has these static methods
type Constructor<T> = {
  new (): T;
  generateKeypair(): Promise<Keypair>;
  prove(
    privateInput: any[],
    publicInput: any[],
    keypair: Keypair,
  ): Promise<Proof>;
  verify(
    publicInput: any[],
    verificationKey: VerificationKey,
    proof: Proof,
  ): Promise<boolean>;
};

export abstract class CircuitWrapper<TCircuit extends Circuit> {
  public constructor(protected circuit: Constructor<TCircuit>) {}

  protected _prove(
    privateInputs: any[],
    publicInputs: any[],
  ): ResultAsync<ZKProof, CircuitError> {
    return this.getKeypair()
      .andThen((keypair) => {
        return ResultAsync.fromPromise(
          this.circuit.prove(privateInputs, publicInputs, keypair),
          (error) => {
            return new CircuitError("Failed to generate proof", error);
          },
        );
      })
      .map((proof) => {
        return ZKProof(ObjectUtils.serialize(proof));
      });
  }
  protected _verify(
    publicInputs: any[],
    proof: ZKProof,
  ): ResultAsync<boolean, CircuitError> {
    return this.getKeypair().andThen((keypair) => {
      return ResultAsync.fromPromise(
        this.circuit.verify(
          publicInputs,
          keypair.verificationKey(),
          ObjectUtils.deserialize(JSONString(proof)),
        ),
        (error) => {
          return new CircuitError("Failed to verify proof", error);
        },
      );
    });
  }

  protected abstract getKeypairResult(): ResultAsync<
    Keypair,
    CircuitError
  > | null;
  protected abstract setKeypairResult(
    result: ResultAsync<Keypair, CircuitError>,
  ): void;

  protected getKeypair(): ResultAsync<Keypair, CircuitError> {
    let keypair = this.getKeypairResult();
    if (keypair == null) {
      keypair = ResultAsync.fromPromise(
        this.circuit.generateKeypair(),
        (error) => {
          return new CircuitError("Failed to generate keypair", error);
        },
      );
      this.setKeypairResult(keypair);
    }
    return keypair;
  }
}
