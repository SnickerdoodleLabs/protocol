import { ApiGatewayConfig } from "@extension-onboarding/services/interfaces/objects";
import { IApiGatewayConfigProvider } from "@extension-onboarding/services/interfaces/utilities";
import { URLString } from "@snickerdoodlelabs/objects";

declare const __GAPI_CLIENT_ID__: string;
declare const __IPFS_FETCH_BASE_URL__: string;

export class ApiGatewayConfigProvider implements IApiGatewayConfigProvider {
  protected config: ApiGatewayConfig;
  constructor() {
    this.config = new ApiGatewayConfig(
      __GAPI_CLIENT_ID__,
      URLString(__IPFS_FETCH_BASE_URL__),
    );
  }
  getConfig(): ApiGatewayConfig {
    return this.config;
  }
}
