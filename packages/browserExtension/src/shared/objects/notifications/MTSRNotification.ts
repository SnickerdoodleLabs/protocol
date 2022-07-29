import { ENotificationTypes } from "@shared/enums/notification";
import { BaseNotification } from "@shared/objects/notifications/BaseNotification";
import {
  EVMAccountAddress,
  EVMContractAddress,
  HexString,
  UUID,
} from "@snickerdoodlelabs/objects";

export class MTSRNotification extends BaseNotification {
  constructor(
    public data: {
      accountAddress: EVMAccountAddress;
      contractAddress: EVMContractAddress;
      data: HexString;
    },
    public id: UUID,
  ) {
    super(ENotificationTypes.INCOMING_METATRANSACTION_SIGNATURE_REQUEST);
  }
}
