import { Readable } from "stream";

import { AjaxError, JsonWebToken } from "@snickerdoodlelabs/objects";
import { AxiosRequestConfig } from "axios";
import { ResultAsync } from "neverthrow";

/**
 * AjaxUtils are just a wrapper around Axios for purposes of testing.
 */
export interface IAxiosAjaxUtils {
  get<T>(url: URL, config?: IRequestConfig): ResultAsync<T, AjaxError>;
  post<T>(
    url: URL,
    data:
      | string
      | Record<string, unknown>
      | ArrayBuffer
      | ArrayBufferView
      | Readable
      | URLSearchParams,
    config?: IRequestConfig,
  ): ResultAsync<T, AjaxError>;
  put<T>(
    url: URL,
    data:
      | string
      | Record<string, unknown>
      | ArrayBuffer
      | ArrayBufferView
      | Readable
      | URLSearchParams,
    config?: IRequestConfig,
  ): ResultAsync<T, AjaxError>;
  delete<T>(url: URL, config?: IRequestConfig): ResultAsync<T, AjaxError>;
  setDefaultToken(token: JsonWebToken): void;
}

export interface IRequestConfig extends AxiosRequestConfig {}

export const IAjaxUtilsType = Symbol.for("IAjaxUtils");
