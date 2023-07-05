import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import browser, { Tabs, Windows } from "webextension-polyfill";

export class ExtensionUtils {
  public static checkForError(): Error | null {
    const { lastError } = browser.runtime;
    if (!lastError) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((lastError as any).stack && lastError.message) {
      return lastError as Error;
    }
    return new Error(lastError.message);
  }

  public static reloadPage = () => {
    browser.runtime.reload();
  };

  public static openTab(
    options: Tabs.CreateCreatePropertiesType,
  ): ResultAsync<browser.Tabs.Tab, Error> {
    return ResultAsync.fromSafePromise<browser.Tabs.Tab, never>(
      browser.tabs.create(options),
    ).andThen((newTab) => {
      const error = ExtensionUtils.checkForError();
      if (error) {
        return errAsync(error);
      }
      return okAsync(newTab);
    });
  }

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

  public static switchToUrlTab = (
    url: string,
    openIfNotExist = false,
    closeCurrenTab = false,
  ): ResultAsync<void, Error> => {
    let constructedUrl: URL;
    try {
      constructedUrl = new URL(url);
    } catch (e) {
      return errAsync(new Error("Invalid URL"));
    }
    return ResultUtils.combine([
      ExtensionUtils.getCurrentWindow(),
      ExtensionUtils.getCurrentTab(),
    ]).andThen(([currentWindow, currentTab]) => {
      const windowId = currentWindow?.id;
      if (windowId) {
        return ExtensionUtils.getAllTabsOnWindow(windowId).andThen((tabs) => {
          const tab = tabs.find((tab) => {
            let tabUrl: URL | undefined;
            try {
              tabUrl = new URL(tab.url || "");
            } catch (e) {
              // URL could not constructed
            }
            if (tabUrl) {
              return tabUrl.origin === constructedUrl.origin;
            }
            return false;
          });
          if (tab) {
            if (tab.id === currentTab?.id) {
              return okAsync(undefined);
            }
            return (
              closeCurrenTab
                ? ExtensionUtils.closeCurrenTab()
                : okAsync(undefined)
            ).andThen(() => {
              return ExtensionUtils.switchToTab(tab.id).map(() => {});
            });
          }
          return openIfNotExist
            ? (closeCurrenTab
                ? ExtensionUtils.closeCurrenTab()
                : okAsync(undefined)
              ).andThen(() => {
                return ExtensionUtils.openTab({ url }).map(() => {});
              })
            : okAsync(undefined);
        });
      } else {
        return openIfNotExist
          ? (closeCurrenTab
              ? ExtensionUtils.closeCurrenTab()
              : okAsync(undefined)
            ).andThen(() => {
              return ExtensionUtils.openTab({ url }).map(() => {});
            })
          : okAsync(undefined);
      }
    });
  };

  public static closeCurrenTab = () => {
    return ExtensionUtils.getCurrentTab().andThen((tab) => {
      if (tab?.id) {
        browser.tabs.remove(tab.id);
      }
      const error = ExtensionUtils.checkForError();
      if (error) {
        return errAsync(error);
      }
      return okAsync(undefined);
    });
  };

  public static closeWindow = (windowId) => {
    browser.windows.remove(windowId);
  };

  public static getAllWindows = (): ResultAsync<
    browser.Windows.Window[],
    unknown
  > => {
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

  public static getActiveTabs = (): ResultAsync<
    browser.Tabs.Tab[],
    unknown
  > => {
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

  public static getAllTabsOnWindow(
    windowId: number,
  ): ResultAsync<Tabs.Tab[], Error> {
    return ResultAsync.fromSafePromise<Tabs.Tab[], never>(
      browser.tabs.query({ windowId }),
    ).andThen((tabs) => {
      const error = ExtensionUtils.checkForError();
      if (error) {
        return errAsync(error);
      }
      return okAsync(tabs);
    });
  }

  public static getCurrentTab = (): ResultAsync<
    browser.Tabs.Tab | undefined,
    Error
  > => {
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

  public static getCurrentWindow = (): ResultAsync<
    browser.Windows.Window,
    Error
  > => {
    return ResultAsync.fromPromise(
      browser.windows.getCurrent(),
      (e) => e as Error,
    ).andThen((tab) => {
      const err = ExtensionUtils.checkForError();
      if (err) {
        return errAsync(err);
      } else {
        return okAsync(tab);
      }
    });
  };

  public static switchToTab(
    tabId: number | undefined,
  ): ResultAsync<browser.Tabs.Tab, Error> {
    return ResultAsync.fromSafePromise<browser.Tabs.Tab, never>(
      browser.tabs.update(tabId, { active: true }),
    ).andThen((tab) => {
      const err = ExtensionUtils.checkForError();
      if (err) {
        return errAsync(err);
      } else {
        return okAsync(tab);
      }
    });
  }

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
}
