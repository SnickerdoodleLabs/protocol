import {
  BigNumberString,
  EVMAccountAddress,
  EVMContractAddress,
  HexString,
  UUID,
} from "@snickerdoodlelabs/objects";

import { ENotificationTypes } from "@shared/enums/notification";
import { BaseNotification } from "@shared/objects/notifications/BaseNotification";

export class MTSRNotification extends BaseNotification {
  constructor(
    public data: {
      accountAddress: EVMAccountAddress;
      contractAddress: EVMContractAddress;
      gas: BigNumberString;
      value: BigNumberString;
      data: HexString;
    },
    public key: UUID,
  ) {
    super(ENotificationTypes.INCOMING_METATRANSACTION_SIGNATURE_REQUEST);
  }
}
