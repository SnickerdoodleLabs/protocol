import { SDQLQueryRequest } from "@objects/businessObjects/SDQLQueryRequest";
import { BaseNotification } from "@objects/extensionShared/businessObjects/BaseNotification";
import { ENotificationTypes } from "@objects/extensionShared/enums/notification";

export class QueryPostedNotification extends BaseNotification<SDQLQueryRequest> {
  constructor(protected q: SDQLQueryRequest) {
    super(ENotificationTypes.QUERY_POSTED, q);
  }
}
