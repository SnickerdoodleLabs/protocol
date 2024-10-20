import {
  Invitation,
  MetatransactionSignatureRequest,
  URLString,
  UUID,
  BaseNotification,
} from "@snickerdoodlelabs/objects";
import { JsonRpcEngine } from "json-rpc-engine";
import { okAsync } from "neverthrow";
import { v4 } from "uuid";

import {
  IPortConnection,
  IPortConnectionObject,
  IPortConnections,
} from "@synamint-extension-sdk/core/interfaces/objects";
import { ExtensionDisplayUtils } from "@synamint-extension-sdk/extensionShared";
import { PORT_NOTIFICATION } from "@synamint-extension-sdk/shared/constants/ports";
import { EPortNames } from "@synamint-extension-sdk/shared/enums/ports";

export class AppContext {
  constructor(
    protected lock: boolean = false,
    protected isNotificationOpen: boolean = false,
    protected notificationWindowId: number | null = null,
    protected isPopupOpen: boolean = false,
    protected currentNotificationPath: string | null = null,
    protected connections: IPortConnections = {},
    protected pendingInvitation: Map<UUID, Invitation> = new Map(),
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
  public addInvitation(invitation: Invitation): UUID {
    const id = v4();
    this.pendingInvitation.set(UUID(id), invitation);
    return UUID(id);
  }
  public getInvitation(id: UUID) {
    return this.pendingInvitation.get(id);
  }
  public removeInvitation(id: UUID) {
    this.pendingInvitation.delete(id);
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

  public addConnection(
    origin: EPortNames | URLString,
    tabId: number | undefined,
    windowId: number | undefined,
    engine: JsonRpcEngine,
  ) {
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

  public removeConnection(origin: EPortNames | URLString, id: string) {
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

  public getActiveRpcConnectionObjectsByOrigin(
    origin: string,
  ): IPortConnectionObject[] {
    return Object.values((this.connections[origin] as IPortConnection) ?? {});
  }

  public notifyConnectionPort(
    rpcEngine: JsonRpcEngine,
    notification: BaseNotification,
  ) {
    rpcEngine.emit(PORT_NOTIFICATION, notification);
  }

  public notifyAllConnections(notification: BaseNotification) {
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
