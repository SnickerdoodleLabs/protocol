import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import Browser from "webextension-polyfill";

import { IScamFilterPreferences } from "@app/Content/components/ScamFilterComponent";
import { IScamFilterSettingsUtils } from "@interfaces/utilities/IScamFilterSettingsUtils";
import { IScamFilterSettingsParams } from "@shared/interfaces/actions";
import { ExtensionStorageError } from "@shared/objects/errors";

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
