import { BaseNotification } from "@objects/extensionShared/businessObjects/BaseNotification.js";
import { ENotificationTypes } from "@objects/extensionShared/enums/notification.js";
import { EVMContractAddress } from "@objects/primitives/EVMContractAddress.js";

export class CohortJoinedNotification extends BaseNotification<EVMContractAddress> {
  constructor(protected consentContractAddress: EVMContractAddress) {
    super(ENotificationTypes.COHORT_JOINED, consentContractAddress);
  }
}
