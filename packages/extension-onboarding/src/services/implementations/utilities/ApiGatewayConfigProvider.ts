import { ApiGatewayConfig } from "@extension-onboarding/services/interfaces/objects";
import { IApiGatewayConfigProvider } from "@extension-onboarding/services/interfaces/utilities";

declare const __GAPI_CLIENT_ID__: string;

export class ApiGatewayConfigProvider implements IApiGatewayConfigProvider {
  protected config: ApiGatewayConfig;
  constructor() {
    this.config = new ApiGatewayConfig(__GAPI_CLIENT_ID__);
  }
  getConfig(): ApiGatewayConfig {
    return this.config;
  }
}
