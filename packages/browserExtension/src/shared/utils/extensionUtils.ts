import { errAsync, okAsync, ResultAsync } from "neverthrow";
import browser, { Tabs, Windows } from "webextension-polyfill";

export class ExtensionUtils {
  public static checkForError = () => {
    const { lastError } = browser.runtime;
    if (!lastError) {
      return undefined;
    }
    // @ts-ignore
    if (lastError?.stack && lastError.message) {
      return lastError;
    }
    return new Error(lastError.message);
  };

  public static reloadPage = () => {
    browser.runtime.reload();
  };

  public static openTab = (options: Tabs.CreateCreatePropertiesType) => {
    return ResultAsync.fromSafePromise(browser.tabs.create(options)).andThen(
      (newTab) => {
        const error = ExtensionUtils.checkForError();
        if (error) {
          return errAsync(error);
        }
        return okAsync(newTab);
      },
    );
  };

  public static openWindow: (
    options: Windows.CreateCreateDataType,
  ) => ResultAsync<Windows.Window, unknown> = (
    options: Windows.CreateCreateDataType,
  ) => {
    return ResultAsync.fromSafePromise(browser.windows.create(options)).andThen(
      (window) => {
        const error = ExtensionUtils.checkForError();
        if (error) {
          return errAsync(error);
        }
        return okAsync(window);
      },
    );
  };

  public static focusWindow = (windowId: number) => {
    return ResultAsync.fromSafePromise(
      browser.windows.update(windowId, { focused: true }),
    ).andThen(() => {
      const error = ExtensionUtils.checkForError();
      if (error) {
        return errAsync(error);
      }
      return okAsync(undefined);
    });
  };

  public static updateWindowPosition = (
    windowId: number,
    left: number,
    top: number,
  ) => {
    return ResultAsync.fromSafePromise(
      browser.windows.update(windowId, { left, top }),
    ).andThen(() => {
      const error = ExtensionUtils.checkForError();
      if (error) {
        return errAsync(error);
      }
      return okAsync(undefined);
    });
  };

  public static getLastFocusedWindow = () => {
    return ResultAsync.fromSafePromise(
      browser.windows.getLastFocused(),
    ).andThen((windowObject) => {
      const error = ExtensionUtils.checkForError();
      if (error) {
        return errAsync(error);
      }
      return okAsync(windowObject);
    });
  };

  public static closeCurrentWindow = () => {
    return ResultAsync.fromSafePromise(browser.windows.getCurrent()).andThen(
      (windowDetails) => {
        if (windowDetails.id) {
          browser.windows.remove(windowDetails.id);
        }
        return okAsync(undefined);
      },
    );
  };

  public static closeCurrenTab = () => {
    return ResultAsync.fromSafePromise(browser.tabs.getCurrent()).andThen(
      (windowDetails) => {
        if (windowDetails.id) {
          browser.tabs.remove(windowDetails.id);
        }
        const error = ExtensionUtils.checkForError();
        if (error) {
          return errAsync(error);
        }
        return okAsync(undefined);
      },
    );
  };

  public static closeWindow = (windowId) => {
    browser.windows.remove(windowId);
  };

  public static getAllWindows = () => {
    return ResultAsync.fromSafePromise(browser.windows.getAll()).andThen(
      (windows) => {
        const error = ExtensionUtils.checkForError();
        if (error) {
          return errAsync(error);
        }
        return okAsync(windows);
      },
    );
  };

  public static getActiveTabs = () => {
    return ResultAsync.fromSafePromise(
      browser.tabs.query({ active: true }),
    ).andThen((tabs) => {
      const error = ExtensionUtils.checkForError();
      if (error) {
        return errAsync(error);
      }
      return okAsync(tabs);
    });
  };

  public static getCurrentTab = () => {
    return ResultAsync.fromSafePromise(browser.tabs.getCurrent()).andThen(
      (tab) => {
        const err = ExtensionUtils.checkForError();
        if (err) {
          return errAsync(err);
        } else {
          return okAsync(tab);
        }
      },
    );
  };

  public static switchToTab = (tabId: number | undefined) => {
    return ResultAsync.fromSafePromise(
      browser.tabs.update(tabId, { highlighted: true }),
    ).andThen((tab) => {
      const err = ExtensionUtils.checkForError();
      if (err) {
        return errAsync(err);
      } else {
        return okAsync(tab);
      }
    });
  };

  public static closeTab = (tabId: number | number[]) => {
    return ResultAsync.fromSafePromise(browser.tabs.remove(tabId)).andThen(
      () => {
        const err = ExtensionUtils.checkForError();
        if (err) {
          return errAsync(err);
        } else {
          return okAsync(undefined);
        }
      },
    );
  };

  public static getManifestVersion = () =>
    browser.runtime.getManifest().manifest_version;

  public static isManifest3 = () => ExtensionUtils.getManifestVersion() === 3;
}
