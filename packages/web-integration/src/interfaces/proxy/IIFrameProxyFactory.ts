import {
  IWebIntegrationConfigOverrides,
  ProxyError,
  URLString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { ISnickerdoodleIFrameProxy } from "@web-integration/interfaces/proxy/ISnickerdoodleIFrameProxy.js";

export interface IIFrameProxyFactory {
  createProxy(
    iframeUrl: URLString,
    configOverrides: IWebIntegrationConfigOverrides,
  ): ResultAsync<ISnickerdoodleIFrameProxy, ProxyError>;
}

export const IIFrameProxyFactoryType = Symbol.for("IIFrameProxyFactory");
