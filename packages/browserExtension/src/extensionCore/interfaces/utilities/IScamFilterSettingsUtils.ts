import {
  DataPermissions,
  EWalletDataType,
  HexString32,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IScamFilterPreferences } from "@app/Content/components/ScamFilterComponent";
import { IScamFilterSettingsParams } from "@shared/interfaces/actions";
import { ExtensionStorageError } from "@shared/objects/errors";

export interface IScamFilterSettingsUtils {
  setScamFilterSettings(
    isScamFilterActive: boolean,
    showMessageEveryTime: boolean,
  ): ResultAsync<void, ExtensionStorageError>;

  getScamFilterSettings(): ResultAsync<
    IScamFilterPreferences,
    ExtensionStorageError
  >;
}

export const IScamFilterSettingsUtilsType = Symbol.for(
  "IScamFilterSettingsUtils",
);
