import { SDQLQueryRequest } from "@objects/businessObjects/SDQLQueryRequest.js";
import { BaseNotification } from "@objects/extensionShared/businessObjects/BaseNotification.js";
import { ENotificationTypes } from "@objects/extensionShared/enums/notification.js";

export class QueryPostedNotification extends BaseNotification<SDQLQueryRequest> {
  constructor(protected q: SDQLQueryRequest) {
    super(ENotificationTypes.QUERY_POSTED, q);
  }
}
