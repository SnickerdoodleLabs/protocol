import { URLString } from "@snickerdoodlelabs/objects";
export class ApiGatewayConfig {
  constructor(public gaClientId: string, public ipfsFetchBaseUrl: URLString) {}
}
