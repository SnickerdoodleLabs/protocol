import { JsonRpcEngine } from "json-rpc-engine";
import { ExtensionDisplayUtils } from "@shared/utils/ExtensionDisplayUtils";
import { v4 } from "uuid";
import { EPortNames, PORT_NOTIFICATION } from "@shared/constants/ports";
import { okAsync } from "neverthrow";
export class AppContext {
  constructor(
    protected lock: boolean = false,
    protected isNotificationOpen: boolean = false,
    protected notificationWindowId: number | null = null,
    protected isPopupOpen: boolean = false,
    protected currentNotificationPath: string | null = null,
    protected connections: {
      [origin: string]: {
        [id: string]: {
          engine: JsonRpcEngine;
          tabId: number;
          windowId: number;
        };
      };
    } = {},
    protected pendingActions: any[] = [],
    protected proccesingAction: any = null,
  ) {}

  public setNotificationOpen(
    notificationWindowId: number,
    currentNotificationPath?: string | null,
  ) {
    this.isNotificationOpen = true;
    this.notificationWindowId = notificationWindowId;
    if (currentNotificationPath) {
      this.currentNotificationPath = currentNotificationPath;
    }
  }

  public setNotificationClose() {
    this.isNotificationOpen = false;
    this.notificationWindowId = null;
    this.currentNotificationPath = null;
  }

  public async displayPopupNotification(path?: string, cb?: () => void) {
    await ExtensionDisplayUtils.showNotificationPopup(
      this.notificationWindowId,
      path,
      cb,
    ).map((notificationWindowId) => {
      if (
        notificationWindowId &&
        this.notificationWindowId !== notificationWindowId
      ) {
        this.setNotificationOpen(notificationWindowId, path);
      }
      return okAsync(undefined);
    });
  }

  public displayAppOnBrowser(path?: string) {
    ExtensionDisplayUtils.openExtensionOnBrowser(path);
  }

  public addConnection(origin, tabId, windowId, engine) {
    if (origin === EPortNames.SD_POPUP) {
      this.isPopupOpen = true;
    }
    const id = v4();
    if (!this.connections[origin]) {
      this.connections[origin] = {};
    }
    this.connections[origin][id] = {
      engine,
      tabId,
      windowId,
    };
    return id;
  }

  public removeConnection(origin, id) {
    if (origin === EPortNames.SD_NOTIFICATION) {
      this.setNotificationClose();
    }
    if (origin === EPortNames.SD_POPUP) {
      this.isNotificationOpen = false;
    }
    const connections = this.connections[origin];
    if (!connections) {
      return;
    }
    const conn = connections[id];
    delete connections[id];

    if (Object.keys(connections).length === 0) {
      delete this.connections[origin];
    }
  }

  public notifyAllConnections(notification: any) {
    Object.values(this.connections).forEach((conns) => {
      Object.keys(conns).forEach((connId) => {
        conns[connId] &&
          conns[connId].engine.emit(PORT_NOTIFICATION, notification);
      });
    });
  }

  public getPendingActions() {
    return this.pendingActions;
  }
}
