import { TimeUtils } from "@snickerdoodlelabs/common-utils";
import { MillisecondTimestamp } from "@snickerdoodlelabs/objects";

const timeUtils = new TimeUtils();
export const rewardless1SchemaStr = JSON.stringify({
  version: 0.1,
  timestamp: timeUtils.getISO8601TimeString(),
  expiry: timeUtils.getISO8601TimeString(
    MillisecondTimestamp(Date.now() + 1000 * 60 * 60 * 24),
  ),
  description: "Interactions with Rewardless Query",
  business: "Ether",
  queries: {
    q1: {
      name: "age",
      return: "boolean",
      conditions: {
        ge: 15,
      },
    },
    q2: {
      name: "location",
      return: "string",
    },
    q3: {
      name: "web3_account_size",
      return: "object",
    },
  },
  insights: {
    i1: {
      name: "age",
      target: "$q1",
      returns: "$q1",
    },
    i2: {
      name: "location",
      target: "$q2",
      returns: "$q2",
    },
    i3: {
      name: "account size",
      target: "$q3",
      returns: "$q3",
    },
  },
  compensations: {
    parameters: {
      recipientAddress: {
        type: "address",
        required: true,
      },
    },
  },
});
