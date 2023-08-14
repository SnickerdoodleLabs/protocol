import { IConfigOverrides } from "@snickerdoodlelabs/objects";

export interface IWebIntegrationConfigProvider {
  getConfig(): IConfigOverrides;
}
