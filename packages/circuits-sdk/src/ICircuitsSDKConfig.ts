import { URLString } from "@snickerdoodlelabs/objects";

export interface ICircuitsSDKConfig {
  /**
   * For local testing, a separate base fetch URL is used to target actual IPFS content specific to Circuits.
   * This URL shares the same override property with the base fetch URL.
   */
  circuitsIpfsFetchBaseUrl: URLString;
}
