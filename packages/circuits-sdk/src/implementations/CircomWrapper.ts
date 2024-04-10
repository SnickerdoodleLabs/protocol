import { ObjectUtils } from "@snickerdoodlelabs/common-utils";
import { CircuitError, JSONString, ZKProof } from "@snickerdoodlelabs/objects";
import { injectable, unmanaged } from "inversify";
import { ResultAsync } from "neverthrow";
import { CircuitSignals, Groth16Proof, PublicSignals, groth16 } from "snarkjs";

@injectable()
export abstract class CircomWrapper<
  TInput extends CircuitSignals,
  TVerifyInput extends PublicSignals,
> {
  public constructor(
    @unmanaged() protected wasm: Uint8Array,
    @unmanaged() protected zkey: Uint8Array,
    @unmanaged() protected vkey: Record<string, unknown>,
  ) {}

  protected _prove(inputs: TInput): ResultAsync<ZKProof, CircuitError> {
    return ResultAsync.fromPromise(
      groth16.fullProve(inputs, this.wasm, this.zkey),
      (e) => {
        return new CircuitError("Unable to run groth16.fullProve", e);
      },
    ).map((result) => {
      const { proof } = result;
      return ZKProof(ObjectUtils.serialize(proof));
    });
  }

  protected _verify(
    proof: ZKProof,
    inputs: TVerifyInput,
  ): ResultAsync<boolean, CircuitError> {
    return ResultAsync.fromPromise(
      groth16.verify(
        this.vkey,
        inputs,
        ObjectUtils.deserialize<Groth16Proof>(JSONString(proof)),
      ),
      (e) => {
        return new CircuitError("Unable to run groth16.verify", e);
      },
    );
  }
}
