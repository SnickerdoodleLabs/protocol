import { BaseNotification } from "@objects/extensionShared/businessObjects/BaseNotification";
import { ENotificationTypes } from "@objects/extensionShared/enums/notification";
import { EVMContractAddress } from "@objects/primitives/EVMContractAddress";

export class CohortJoinedNotification extends BaseNotification {
  constructor(
    public data: {
      consentContractAddress: EVMContractAddress;
    },
  ) {
    super(ENotificationTypes.COHORT_JOINED);
  }
}
