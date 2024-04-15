import { ObjectUtils } from "@snickerdoodlelabs/common-utils";
import { CircuitError, JSONString, ZKProof } from "@snickerdoodlelabs/objects";
import { injectable, unmanaged } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";
import { CircuitSignals, Groth16Proof, PublicSignals, groth16 } from "snarkjs";

@injectable()
export abstract class CircomWrapper<
  TInput extends CircuitSignals,
  TVerifyInput extends PublicSignals,
> {
  protected wasmPromise: Promise<Uint8Array>;
  protected zkeyPromise: Promise<Uint8Array>;

  public constructor(
    wasmLoader: () => Promise<Uint8Array>,
    zkeyLoader: () => Promise<Uint8Array>,
    @unmanaged() protected vkey: Record<string, unknown>,
  ) {
    this.wasmPromise = wasmLoader();
    this.zkeyPromise = zkeyLoader();
  }

  private _loadResources(): ResultAsync<
    [Uint8Array, Uint8Array],
    CircuitError
  > {
    return ResultAsync.fromPromise(
      Promise.allSettled([this.wasmPromise, this.zkeyPromise]).then(
        (results) => {
          const wasmResult = results[0];
          const zkeyResult = results[1];

          if (wasmResult.status === "rejected") {
            return Promise.reject(
              new CircuitError("WASM loading failed: " + wasmResult.reason),
            );
          }
          if (zkeyResult.status === "rejected") {
            return Promise.reject(
              new CircuitError("ZKey loading failed: " + zkeyResult.reason),
            );
          }

          return Promise.resolve([wasmResult.value, zkeyResult.value]);
        },
      ),
      () => new CircuitError("Error while loading WASM and Zkey Resources"),
    );
  }

  protected _prove(inputs: TInput): ResultAsync<ZKProof, CircuitError> {
    return this._loadResources().andThen(([wasm, zkey]) => {
      return ResultAsync.fromPromise(
        groth16.fullProve(inputs, wasm, zkey),
        (e) => {
          return new CircuitError("Unable to run groth16.fullProve", e);
        },
      ).map((result) => {
        const { proof } = result;
        return ZKProof(ObjectUtils.serialize(proof));
      });
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
