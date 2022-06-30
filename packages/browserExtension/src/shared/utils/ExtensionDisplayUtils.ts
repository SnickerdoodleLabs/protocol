import { errAsync, okAsync } from "neverthrow";
import { ExtensionUtils } from "@shared/utils/ExtensionUtils";

const NOTIFICATION_HEIGHT = 600;
const NOTIFICATION_WIDTH = 470;

export class ExtensionDisplayUtils {
  public static showNotificationPopup = (
    notificationId: number | null,
    path?: string,
    cb?: () => void,
  ) => {
    if (notificationId) {
      return ExtensionDisplayUtils.checkNotification(notificationId).andThen(
        (notification) => {
          if (notification) {
            ExtensionUtils.focusWindow(notification.id!);
            cb?.();
            return okAsync(notification.id);
          }
          return ExtensionDisplayUtils.createPopup(path);
        },
      );
    }
    return ExtensionDisplayUtils.createPopup(path);
  };

  public static createPopup = (path?) => {
    let left = 0;
    let top = 0;
    return ExtensionUtils.getLastFocusedWindow().andThen((focusedWindow) => {
      if (focusedWindow) {
        top = focusedWindow.top!;
        left =
          focusedWindow.left! + (focusedWindow.width! - NOTIFICATION_WIDTH);
      } else {
        const { screenX, screenY, outerWidth } = window;
        top = Math.max(screenY, 0);
        left = Math.max(screenX + (outerWidth - NOTIFICATION_WIDTH), 0);
      }

      return ExtensionUtils.openWindow({
        url: `popup.html${path ?? ""}#notification`,
        type: "popup",
        width: NOTIFICATION_WIDTH,
        height: NOTIFICATION_HEIGHT,
        left,
        top,
      }).andThen((window) => {
        return okAsync(window.id);
      });
    });
  };

  public static openExtensionOnBrowser = async (path?: string) => {
    await ExtensionUtils.openTab({
      url: `popup.html${path ?? ""}#fullScreen`,
    });
  };

  public static checkNotification = (notificationId: number) => {
    return ExtensionUtils.getAllWindows().andThen((windows) => {
      const window = windows?.find(
        (win) => win && win.type === "popup" && win.id === notificationId,
      );
      if (window) {
        return okAsync(window);
      }
      return errAsync(undefined);
    });
  };
}
