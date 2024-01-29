import { ResultAsync } from "neverthrow";

import { ERC7529Config } from "@erc7529/ERC7529Config.js";

export interface IERC7529ConfigProvider {
  getConfig(): ResultAsync<ERC7529Config, never>;
}

export const IERC7529ConfigProviderType = Symbol.for("IERC7529ConfigProvider");
