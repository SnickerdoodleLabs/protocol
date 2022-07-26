import { ApiGatewayConfig } from "@extension-onboarding/services/interfaces/objects";

export interface IApiGatewayConfigProvider {
  getConfig(): ApiGatewayConfig;
}
