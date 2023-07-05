import { ENotificationTypes } from "@objects/extensionShared/enums/notification";
import { UUID } from "@objects/primitives/UUID";
import { v4 } from "uuid";

export class BaseNotification {
  public key: UUID;
  constructor(public type: ENotificationTypes) {
    this.key = UUID(v4());
  }
}
