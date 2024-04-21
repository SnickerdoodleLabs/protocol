import { commitmentCode } from "@snickerdoodlelabs/circuits/src/circom/commitment/commitment.wasm.js";
import { commitmentZKey } from "@snickerdoodlelabs/circuits/src/circom/commitment/commitment.zkey.js";
import { semaphoreCode } from "@snickerdoodlelabs/circuits/src/circom/semaphore/semaphore.wasm.js";
import { semaphoreZKey } from "@snickerdoodlelabs/circuits/src/circom/semaphore/semaphore.zkey.js";
import {
  IAxiosAjaxUtils,
  IRequestConfig,
} from "@snickerdoodlelabs/common-utils";
import { AjaxError, JsonWebToken } from "@snickerdoodlelabs/objects";
import { ResultAsync, errAsync, okAsync } from "neverthrow";
export class MockAjaxUtils implements IAxiosAjaxUtils {
  post<T>(
    url: URL,
    data?:
      | string
      | Record<string, unknown>
      | ArrayBuffer
      | ArrayBufferView
      | URLSearchParams
      | undefined,
    config?: IRequestConfig | undefined,
  ): ResultAsync<T, AjaxError> {
    throw new Error("Method not implemented.");
  }
  put<T>(
    url: URL,
    data:
      | string
      | Record<string, unknown>
      | ArrayBuffer
      | ArrayBufferView
      | URLSearchParams,
    config?: IRequestConfig | undefined,
  ): ResultAsync<T, AjaxError> {
    throw new Error("Method not implemented.");
  }
  delete<T>(
    url: URL,
    config?: IRequestConfig | undefined,
  ): ResultAsync<T, AjaxError> {
    throw new Error("Method not implemented.");
  }
  setDefaultToken(token: JsonWebToken): void {
    throw new Error("Method not implemented.");
  }
  public get<T>(url: URL): ResultAsync<T, AjaxError> {
    const mockData = new Map<string, Uint8Array>([
      ["QmT5avnPx18LMdbzbHgVHJrkzUgwt7sFMoqhEHYBukF6eP", commitmentCode],
      ["QmesxcQYvng3crv34r557WiFTdnvGH3uzvxVRCcaftZWxa", commitmentZKey],
      ["QmUSxnC3YNkH92HNkzqYxAWV2T8uioe2Uxm4Zfa7NbJNHs", semaphoreCode],
      ["QmUk9mbuHQEir1uWMGweLdTVhGNVpxf4KrnkGj9Xwnhfbc", semaphoreZKey],
    ]);

    const key = url.pathname.split("/").pop();
    if (key != null) {
      return okAsync(mockData.get(key) as T);
    }
    return errAsync(
      new AjaxError("Mock Ajax Utils failed to get the key from url", 500),
    );
  }
}
