import { AjaxError, JsonWebToken } from "@snickerdoodlelabs/objects";
import axios, { AxiosResponse } from "axios";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { Readable } from "stream";

import { IAxiosAjaxUtils, IRequestConfig } from "@common-utils/interfaces";

@injectable()
export class AxiosAjaxUtils implements IAxiosAjaxUtils {
  public get<T>(url: URL, config?: IRequestConfig): ResultAsync<T, AjaxError> {
    return ResultAsync.fromPromise(
      axios.get(url.toString(), config),
      (e) => new AjaxError(`Unable to get ${url}`, e),
    ).map((response: AxiosResponse<T>) => {
      return response.data;
    });
  }

  public post<T>(
    url: URL,
    data:
      | string
      | Record<string, unknown>
      | ArrayBuffer
      | ArrayBufferView
      | Readable
      | URLSearchParams,
    config?: IRequestConfig,
  ): ResultAsync<T, AjaxError> {
    return ResultAsync.fromPromise(
      axios.post(url.toString(), data, config),
      (e) => new AjaxError(`Unable to post ${url}`, e),
    ).map((response: AxiosResponse<T>) => {
      return response.data;
    });
  }

  public put<T>(
    url: URL,
    data:
      | string
      | Record<string, unknown>
      | ArrayBuffer
      | ArrayBufferView
      | Readable
      | URLSearchParams,
    config?: IRequestConfig,
  ): ResultAsync<T, AjaxError> {
    return ResultAsync.fromPromise(
      axios.put(url.toString(), data, config),
      (e) => new AjaxError(`Unable to put ${url}`, e),
    ).map((response: AxiosResponse<T>) => {
      return response.data;
    });
  }

  public delete<T>(
    url: URL,
    config?: IRequestConfig,
  ): ResultAsync<T, AjaxError> {
    return ResultAsync.fromPromise(
      axios.delete(url.toString(), config),
      (e) => new AjaxError(`Unable to delete ${url}`, e),
    ).map((response: AxiosResponse<T>) => {
      return response.data;
    });
  }

  public setDefaultToken(token: JsonWebToken): void {
    axios.defaults.headers.common = { authorization: `Bearer ${token}` };
  }
}
