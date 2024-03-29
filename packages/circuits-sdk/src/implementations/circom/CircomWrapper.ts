import { ObjectUtils } from "@snickerdoodlelabs/common-utils";
import { CircuitError, ZKProof } from "@snickerdoodlelabs/objects";
import { unmanaged } from "inversify";
import { ResultAsync } from "neverthrow";
import { CircuitSignals, groth16 } from "snarkjs";

export abstract class CircomWrapper<TInput extends CircuitSignals> {
  public constructor(
    @unmanaged() protected wasm: Uint8Array,
    @unmanaged() protected zkey: Uint8Array,
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
}
