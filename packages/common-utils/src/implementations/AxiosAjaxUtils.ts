import * as http from "http";
import { Readable } from "stream";

import { AjaxError, JsonWebToken } from "@snickerdoodlelabs/objects";
import axios, { AxiosAdapter, AxiosInstance, AxiosResponse } from "axios";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import fetchAdapter from "@common-utils/implementations/FetchAdapter.js";
import {
  IAxiosAjaxUtils,
  IRequestConfig,
} from "@common-utils/interfaces/index.js";

@injectable()
export class AxiosAjaxUtils implements IAxiosAjaxUtils {
  protected instance: AxiosInstance;
  public constructor() {
    // Browsers have XMLHttpRequest, node has the http object. Axios will use
    // the right one depending. But server workers have neither, and need to
    // use the fetch adapter.
    // These checks are a PITA
    if (typeof importScripts === "function") {
      this.instance = axios.create({
        adapter: fetchAdapter as AxiosAdapter,
      });
    } else {
      this.instance = axios.create({});
    }
  }

  public get<T>(url: URL, config?: IRequestConfig): ResultAsync<T, AjaxError> {
    return ResultAsync.fromPromise(
      this.instance.get(this.stripTrailingSlash(url.toString()), config),
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
      this.instance.post(this.stripTrailingSlash(url.toString()), data, config),
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
      this.instance.put(this.stripTrailingSlash(url.toString()), data, config),
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
      this.instance.delete(this.stripTrailingSlash(url.toString()), config),
      (e) => new AjaxError(`Unable to delete ${url}`, e),
    ).map((response: AxiosResponse<T>) => {
      return response.data;
    });
  }

  public setDefaultToken(token: JsonWebToken): void {
    this.instance.defaults.headers.common = {
      authorization: `Bearer ${token}`,
    };
  }

  private stripTrailingSlash(url: string) {
    return url.endsWith("/") ? url.slice(0, -1) : url;
  }
}
