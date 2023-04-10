import { Readable } from "stream";

import {
  IAxiosAjaxUtils,
  IRequestConfig,
} from "@snickerdoodlelabs/common-utils";
import { AjaxError, JsonWebToken } from "@snickerdoodlelabs/objects";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

export class AjaxUtilsMock implements IAxiosAjaxUtils {
  protected configuredGetReturns = new Map<string, unknown>();

  public addGetReturn(url: string, value: unknown): void {
    this.configuredGetReturns.set(url, value);
  }
  public get<T>(
    url: URL,
    config?: IRequestConfig | undefined,
  ): ResultAsync<T, AjaxError> {
    let val: unknown = null;
    const urlStr = url.toString();
    if (this.configuredGetReturns.has(urlStr)) {
      val = this.configuredGetReturns.get(urlStr);
    } else {
      for (const [k, v] of this.configuredGetReturns) {
        if (urlStr.endsWith(k)) {
          val = v;
          break;
        }
      }
    }

    if (val != null) {
      return okAsync(val as T);
    }

    return errAsync(new AjaxError(`No return configured for url ${url}`));
  }

  public post<T>(
    url: URL,
    data:
      | string
      | Readable
      | Record<string, unknown>
      | ArrayBuffer
      | ArrayBufferView
      | URLSearchParams,
    config?: IRequestConfig | undefined,
  ): ResultAsync<T, AjaxError> {
    throw new Error("Method not implemented.");
  }
  public put<T>(
    url: URL,
    data:
      | string
      | Readable
      | Record<string, unknown>
      | ArrayBuffer
      | ArrayBufferView
      | URLSearchParams,
    config?: IRequestConfig | undefined,
  ): ResultAsync<T, AjaxError> {
    throw new Error("Method not implemented.");
  }
  public delete<T>(
    url: URL,
    config?: IRequestConfig | undefined,
  ): ResultAsync<T, AjaxError> {
    throw new Error("Method not implemented.");
  }
  public setDefaultToken(token: JsonWebToken): void {
    throw new Error("Method not implemented.");
  }
}
