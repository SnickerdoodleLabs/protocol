import { ObjectUtils, IAxiosAjaxUtils } from "@snickerdoodlelabs/common-utils";
import {
  CircuitError,
  JSONString,
  ZKProof,
  IpfsCID,
  AjaxError,
} from "@snickerdoodlelabs/objects";
import { injectable, unmanaged } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";
import { CircuitSignals, Groth16Proof, PublicSignals, groth16 } from "snarkjs";
import { urlJoin } from "url-join-ts";

import { ICircutsSDKConfigProvider } from "@circuits-sdk/ICircutsSDKConfigProvider.js";
@injectable()
export abstract class CircomWrapper<
  TInput extends CircuitSignals,
  TVerifyInput extends PublicSignals,
> {
  private _wasmPromise?: ResultAsync<Uint8Array, AjaxError | CircuitError>;
  private _zkeyPromise?: ResultAsync<Uint8Array, AjaxError | CircuitError>;
  public constructor(
    @unmanaged() protected ajaxUtils: IAxiosAjaxUtils,
    @unmanaged() protected circutsSDKConfig: ICircutsSDKConfigProvider,
    @unmanaged() protected vkey: Record<string, unknown>,
    @unmanaged() protected wasmKey: IpfsCID,
    @unmanaged() protected zkeyKey: IpfsCID,
  ) {}

  public preFetch(): ResultAsync<undefined, never> {
    return this.circutsSDKConfig.getConfig().andThen((config) => {
      const wasmUrl = new URL(urlJoin(config.ipfsFetchBaseUrl, this.wasmKey));
      this.setWasmLoader(() =>
        this.ajaxUtils.get<string>(wasmUrl).map((data) => {
          return new Uint8Array(Buffer.from(data, "base64").buffer);
        }),
      );

      const zkeyUrl = new URL(urlJoin(config.ipfsFetchBaseUrl, this.zkeyKey));
      this.setZKeyLoader(() =>
        this.ajaxUtils.get<string>(zkeyUrl).map((data) => {
          return new Uint8Array(Buffer.from(data, "base64").buffer);
        }),
      );
      return okAsync(undefined);
    });
  }

  protected setWasmLoader(
    loader: () => ResultAsync<Uint8Array, AjaxError | CircuitError>,
  ) {
    this._wasmPromise = loader();
  }

  protected setZKeyLoader(
    loader: () => ResultAsync<Uint8Array, AjaxError | CircuitError>,
  ) {
    this._zkeyPromise = loader();
  }

  protected get wasmPromise(): ResultAsync<
    Uint8Array,
    AjaxError | CircuitError
  > {
    if (this._wasmPromise == null) {
      return errAsync(new CircuitError("WASM loader has not been set"));
    }
    return this._wasmPromise;
  }

  protected get zkeyPromise(): ResultAsync<
    Uint8Array,
    AjaxError | CircuitError
  > {
    if (this._zkeyPromise == null) {
      return errAsync(new CircuitError("ZKey loader has not been set"));
    }
    return this._zkeyPromise;
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

  private _loadResources(): ResultAsync<
    [Uint8Array, Uint8Array],
    CircuitError
  > {
    return ResultAsync.combine([this.wasmPromise, this.zkeyPromise])
      .mapErr((errors) => {
        let errorMessage = "Error while loading resources:";
        if (Array.isArray(errors)) {
          if (errors[0] instanceof CircuitError) {
            errorMessage += " WASM loading failed: " + errors[0].message;
          }
          if (errors[1] instanceof CircuitError) {
            errorMessage += " ZKey loading failed: " + errors[1].message;
          }
        } else {
          errorMessage += errors.message;
        }

        return new CircuitError(errorMessage);
      })
      .map(([wasmData, zkeyData]) => {
        return [wasmData, zkeyData];
      });
  }
}
