import { IScamFilterSettingsUtils } from "@synamint-extension-sdk/core/interfaces/utilities/IScamFilterSettingsUtils";
import { IScamFilterPreferences } from "@synamint-extension-sdk/shared/interfaces/scamFilterPreferences";
import { ExtensionStorageError } from "@synamint-extension-sdk/shared/objects/errors";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import Browser from "webextension-polyfill";

@injectable()
export class ScamFilterSettingsUtils implements IScamFilterSettingsUtils {
  public setScamFilterSettings(
    isScamFilterActive: boolean,
    showMessageEveryTime: boolean,
  ): ResultAsync<void, ExtensionStorageError> {
    return ResultAsync.fromPromise(
      Browser.storage.local.set({
        scamFilterSettings: JSON.stringify({
          isScamFilterActive,
          showMessageEveryTime,
        }),
      }),
      (e) =>
        new ExtensionStorageError(
          "could not set value of applyDefaultPermissionsOption",
        ),
    );
  }
  public getScamFilterSettings(): ResultAsync<
    IScamFilterPreferences,
    ExtensionStorageError
  > {
    return ResultAsync.fromPromise(
      Browser.storage.local.get("scamFilterSettings"),
      (e) =>
        new ExtensionStorageError(
          "could not read key applyDefaultPermissionsOption",
        ),
    ).map((res) => {
      return res.scamFilterSettings
        ? JSON.parse(res.scamFilterSettings)
        : { isScamFilterActive: true, showMessageEveryTime: true };
    });
  }
}
