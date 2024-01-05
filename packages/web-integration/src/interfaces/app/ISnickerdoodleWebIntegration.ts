import { ISdlDataWallet } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ISnickerdoodleWebIntegration {
  core: ISdlDataWallet;

  /**
   * Initialize the web integration. Must be called before accessing core,
   * even if a proxy was injected.
   */
  initialize(): ResultAsync<ISdlDataWallet, Error>;
  requestDashboardView(): void;
}
