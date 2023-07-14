import { ISdlDataWallet } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ISnickerdoodleWebIntegration {
  core: ISdlDataWallet;
  initialize(): ResultAsync<ISdlDataWallet, Error>;
}
