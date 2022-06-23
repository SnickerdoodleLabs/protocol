import browser, { Tabs, Windows } from "webextension-polyfill";

export const checkForError = () => {
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

export const reloadPage = () => {
  browser.runtime.reload();
};

export const openTab = (options: Tabs.CreateCreatePropertiesType) =>
  new Promise((resolve, reject) => {
    browser.tabs.create(options).then((newTab) => {
      const error = checkForError();
      if (error) {
        return reject(error);
      }
      return resolve(newTab);
    });
  });

export const openWindow: (
  options: Windows.CreateCreateDataType,
) => Promise<Windows.Window> = (options: Windows.CreateCreateDataType) =>
  new Promise((resolve, reject) => {
    browser.windows.create(options).then((newWindow) => {
      const error = checkForError();
      if (error) {
        return reject(error);
      }
      return resolve(newWindow);
    });
  });

export const focusWindow = (windowId: number) =>
  new Promise<void>((resolve, reject) => {
    browser.windows.update(windowId, { focused: true }).then(() => {
      const error = checkForError();
      if (error) {
        return reject(error);
      }
      return resolve();
    });
  });

export const updateWindowPosition = (
  windowId: number,
  left: number,
  top: number,
) =>
  new Promise<void>((resolve, reject) => {
    browser.windows.update(windowId, { left, top }).then(() => {
      const error = checkForError();
      if (error) {
        return reject(error);
      }
      return resolve();
    });
  });

export const getLastFocusedWindow: () => Promise<Windows.Window> = () =>
  new Promise((resolve, reject) => {
    browser.windows.getLastFocused().then((windowObject) => {
      const error = checkForError();
      if (error) {
        return reject(error);
      }
      return resolve(windowObject);
    });
  });

export const closeCurrentWindow = () => {
  browser.windows.getCurrent().then((windowDetails) => {
    if (windowDetails.id) {
      browser.windows.remove(windowDetails.id);
    }
  });
};

export const closeWindow = (windowId) => {
  browser.windows.remove(windowId);
};

export const getAllWindows: () => Promise<Windows.Window[]> = () =>
  new Promise((resolve, reject) => {
    browser.windows.getAll().then((windows) => {
      const error = checkForError();
      if (error) {
        return reject(error);
      }
      return resolve(windows);
    });
  });

export const getActiveTabs = () =>
  new Promise((resolve, reject) => {
    browser.tabs.query({ active: true }).then((tabs) => {
      const error = checkForError();
      if (error) {
        return reject(error);
      }
      return resolve(tabs);
    });
  });

export const getCurrentTab = () =>
  new Promise((resolve, reject) => {
    browser.tabs.getCurrent().then((tab) => {
      const err = checkForError();
      if (err) {
        reject(err);
      } else {
        resolve(tab);
      }
    });
  });

export const switchToTab = (tabId: number | undefined) =>
  new Promise((resolve, reject) => {
    browser.tabs.update(tabId, { highlighted: true }).then((tab) => {
      const err = checkForError();
      if (err) {
        reject(err);
      } else {
        resolve(tab);
      }
    });
  });

export const closeTab = (tabId: number | number[]) =>
  new Promise<void>((resolve, reject) => {
    browser.tabs.remove(tabId).then(() => {
      const err = checkForError();
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

export const getManifestVersion = () =>
  browser.runtime.getManifest().manifest_version;

export const isManifest3 = () => getManifestVersion() === 3;
