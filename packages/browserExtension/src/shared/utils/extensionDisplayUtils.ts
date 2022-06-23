import {
  focusWindow,
  getLastFocusedWindow,
  openWindow,
  getAllWindows,
  openTab,
} from "shared/utils/extensionUtils";
import browser, { Tabs, Windows } from "webextension-polyfill";

const NOTIFICATION_HEIGHT = 600;
const NOTIFICATION_WIDTH = 470;

export const showNotificationPopup = async (
  notificationId: number | null,
  path?: string,
  cb?: () => void,
) => {
  const notification = notificationId
    ? await checkNotification(notificationId)
    : undefined;
  if (notification) {
    // focus existing instance
    await focusWindow(notification.id!);
    cb?.();
    return notification.id!;
  } else {
    let left = 0;
    let top = 0;
    try {
      const lastFocused = await getLastFocusedWindow();
      // Position window through lastFocused window.
      top = lastFocused.top!;
      left = lastFocused.left! + (lastFocused.width! - NOTIFICATION_WIDTH);
    } catch (_) {
      const { screenX, screenY, outerWidth } = window;
      top = Math.max(screenY, 0);
      left = Math.max(screenX + (outerWidth - NOTIFICATION_WIDTH), 0);
    }
    // create new notification window
    const notificationWindow = await openWindow({
      url: `popup.html${path ?? ""}#notification`,
      type: "popup",
      width: NOTIFICATION_WIDTH,
      height: NOTIFICATION_HEIGHT,
      left,
      top,
    });

    return notificationWindow.id;
  }
};

export const openExtensionOnBrowser = async (path?: string) => {
  await openWindow({
    url: `popup.html${path ?? ""}#fullScreen`,
    type: "panel",
    focused: true,
  });
};

export const checkNotification = async (notificationId: number) => {
  const windows = await getAllWindows();
  return windows
    ? windows.find((win) => {
        return win && win.type === "popup" && win.id === notificationId;
      })
    : null;
};
