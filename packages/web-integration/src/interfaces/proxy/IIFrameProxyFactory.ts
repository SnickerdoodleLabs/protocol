import {
  IConfigOverrides,
  ProxyError,
  URLString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { ISnickerdoodleIFrameProxy } from "@web-integration/interfaces/proxy/ISnickerdoodleIFrameProxy.js";

export interface IIFrameProxyFactory {
  createProxy(
    iframeUrl: URLString,
    configOverrides: IConfigOverrides,
  ): ResultAsync<ISnickerdoodleIFrameProxy, ProxyError>;
}

export const IIFrameProxyFactoryType = Symbol.for("IIFrameProxyFactory");
