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
import { ResultUtils } from "neverthrow-result-utils";
import { CircuitSignals, Groth16Proof, PublicSignals, groth16 } from "snarkjs";
import { urlJoin } from "url-join-ts";

import { ICircuitsSDKConfigProvider } from "@circuits-sdk/ICircuitsSDKConfigProvider.js";
import { ICircomWrapper } from "@circuits-sdk/interfaces/ICircomWrapper.js";
@injectable()
export abstract class CircomWrapper<
  TInput extends CircuitSignals,
  TVerifyInput extends PublicSignals,
> implements ICircomWrapper
{
  private _wasmResult?: ResultAsync<Uint8Array, AjaxError | CircuitError>;
  private _zkeyResult?: ResultAsync<Uint8Array, AjaxError | CircuitError>;
  public constructor(
    @unmanaged() protected ajaxUtils: IAxiosAjaxUtils,
    @unmanaged() protected circuitsSDKConfig: ICircuitsSDKConfigProvider,
    @unmanaged() protected vkey: Record<string, unknown>,
    @unmanaged() protected wasmKey: IpfsCID,
    @unmanaged() protected zkeyKey: IpfsCID,
  ) {}

  public preFetch(): ResultAsync<void, AjaxError | CircuitError> {
    return this.circuitsSDKConfig.getConfig().andThen((config) => {
      const wasmUrl = new URL(
        urlJoin(config.circuitsIpfsFetchBaseUrl, this.wasmKey),
      );
      const zkeyUrl = new URL(
        urlJoin(config.circuitsIpfsFetchBaseUrl, this.zkeyKey),
      );

      this._wasmResult = this.fetchResource(wasmUrl);
      this._zkeyResult = this.fetchResource(zkeyUrl);

      return ResultUtils.combine([this._wasmResult, this._zkeyResult]).map(
        () => {},
      );
    });
  }

  protected get wasmResult(): ResultAsync<
    Uint8Array,
    AjaxError | CircuitError
  > {
    if (this._wasmResult == null) {
      this._wasmResult = this.getResourceUrl(this.wasmKey).andThen((url) =>
        this.fetchResource(url),
      );
    }
    return this._wasmResult;
  }

  protected get zkeyResult(): ResultAsync<
    Uint8Array,
    AjaxError | CircuitError
  > {
    if (this._zkeyResult == null) {
      this._zkeyResult = this.getResourceUrl(this.zkeyKey).andThen((url) =>
        this.fetchResource(url),
      );
    }
    return this._zkeyResult;
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
    return ResultUtils.combine([this.wasmResult, this.zkeyResult]).mapErr(
      (errors) => {
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
      },
    );
  }

  private fetchResource(
    url: URL,
  ): ResultAsync<Uint8Array, AjaxError | CircuitError> {
    return this.ajaxUtils
      .get<string>(url)
      .map((data) => {
        return new Uint8Array(Buffer.from(data, "base64").buffer);
      })
      .mapErr(
        (error) =>
          new CircuitError(`Error fetching resource from ${url}`, error),
      );
  }

  private getResourceUrl(key: IpfsCID): ResultAsync<URL, CircuitError> {
    return this.circuitsSDKConfig
      .getConfig()
      .map((config) => {
        return new URL(urlJoin(config.circuitsIpfsFetchBaseUrl, key));
      })
      .mapErr((error) => new CircuitError("Error fetching config", error));
  }
}
