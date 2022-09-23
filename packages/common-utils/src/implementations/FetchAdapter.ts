// Stolen from https://github.com/vespaiach/axios-fetch-adapter, but that
// package does not work in CommonJS (it is using import internally)

import AxiosError from "axios/lib/core/AxiosError.js";
import buildFullPath from "axios/lib/core/buildFullPath.js";
import settle from "axios/lib/core/settle.js";
import buildURL from "axios/lib/helpers/buildURL.js";
import { isUndefined } from "axios/lib/utils.js";

/**
 * - Create a request object
 * - Get response body
 * - Check if timeout
 */
export default async function fetchAdapter(config) {
  const request = createRequest(config);
  const promiseChain = [getResponse(request, config)];

  if (config.timeout && config.timeout > 0) {
    promiseChain.push(
      new Promise((res) => {
        setTimeout(() => {
          const message = config.timeoutErrorMessage
            ? config.timeoutErrorMessage
            : "timeout of " + config.timeout + "ms exceeded";
          res(new AxiosError(message, "ECONNABORTED", config, request));
        }, config.timeout);
      }),
    );
  }

  const data = await Promise.race(promiseChain);
  return new Promise((resolve, reject) => {
    if (data instanceof Error) {
      reject(data);
    } else {
      Object.prototype.toString.call(config.settle) === "[object Function]"
        ? config.settle(resolve, reject, data)
        : settle(resolve, reject, data);
    }
  });
}

/**
 * Fetch API stage two is to get response body. This funtion tries to retrieve
 * response body based on response's type
 */
async function getResponse(request, config) {
  let stageOne;
  try {
    stageOne = await fetch(request);
  } catch (e) {
    return new AxiosError("Network Error", "ERR_NETWORK", config, request);
  }

  const response = {
    ok: stageOne.ok,
    status: stageOne.status,
    statusText: stageOne.statusText,
    headers: new Headers(stageOne.headers), // Make a copy of headers
    config: config,
    request,
    data: undefined,
  };

  if (stageOne.status >= 200 && stageOne.status !== 204) {
    switch (config.responseType) {
      case "arraybuffer":
        response.data = await stageOne.arrayBuffer();
        break;
      case "blob":
        response.data = await stageOne.blob();
        break;
      case "json":
        response.data = await stageOne.json();
        break;
      case "formData":
        response.data = await stageOne.formData();
        break;
      default:
        response.data = await stageOne.text();
        break;
    }
  }

  return response;
}

/**
 * This function will create a Request object based on configuration's axios
 */
function createRequest(config) {
  const headers = new Headers(config.headers);

  // HTTP basic authentication
  if (config.auth) {
    const username = config.auth.username || "";
    const password = config.auth.password
      ? decodeURI(encodeURIComponent(config.auth.password))
      : "";
    headers.set("Authorization", `Basic ${btoa(username + ":" + password)}`);
  }

  const method = config.method.toUpperCase();
  const options = {
    headers: headers,
    method,
    body: undefined,
    mode: undefined,
    cache: undefined,
    integrity: undefined,
    redirect: undefined,
    referrer: undefined,
    credentials: undefined as RequestCredentials | undefined,
  };
  if (method !== "GET" && method !== "HEAD") {
    options.body = config.data;
  }
  if (config.mode) {
    options.mode = config.mode;
  }
  if (config.cache) {
    options.cache = config.cache;
  }
  if (config.integrity) {
    options.integrity = config.integrity;
  }
  if (config.redirect) {
    options.redirect = config.redirect;
  }
  if (config.referrer) {
    options.referrer = config.referrer;
  }
  // This config is similar to XHR’s withCredentials flag, but with three available values instead of two.
  // So if withCredentials is not set, default value 'same-origin' will be used
  if (!isUndefined(config.withCredentials)) {
    options.credentials = config.withCredentials ? "include" : "omit";
  }

  const fullPath = buildFullPath(config.baseURL, config.url);
  const url = buildURL(fullPath, config.params, config.paramsSerializer);

  // Expected browser to throw error if there is any wrong configuration value
  return new Request(url, options);
}
