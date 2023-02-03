import { IScamFilterPreferences } from "@synamint-extension-sdk/shared/interfaces/scamFilterPreferences";
import { ExtensionStorageError } from "@synamint-extension-sdk/shared/objects/errors";
import { ResultAsync } from "neverthrow";

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
