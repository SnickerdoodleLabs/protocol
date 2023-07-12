import { ENotificationTypes } from "@objects/extensionShared/enums/notification";
import { UUID } from "@objects/primitives/UUID";
import { v4 } from "uuid";

export class BaseNotification<T = any> {
  public key: UUID;
  constructor(public type: ENotificationTypes, public data: T) {
    this.key = UUID(v4());
  }
}
