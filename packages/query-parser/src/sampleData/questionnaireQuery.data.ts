import { TimeUtils } from "@snickerdoodlelabs/common-utils";
import { MillisecondTimestamp } from "@snickerdoodlelabs/objects";

const timeUtils = new TimeUtils();
export const questionnaireQuery = JSON.stringify({
  version: 0.1,
  timestamp: timeUtils.getISO8601TimeString(),
  expiry: timeUtils.getISO8601TimeString(
    MillisecondTimestamp(Date.now() + 1000 * 60 * 60 * 24),
  ),
  description:
    "Passing a Questionnaire into our system",
  business: "Google",
  queries: {
    q1: {
      name: "questionnaire",
      return: "object",
      cid: "QmbWqxBEKC3P8tqsKc98xmWN33432RLMiMPL8wBuTGsMnR",
    },
  },
  insights: {
    i1: {
      name: "Questionnaire",
      target: "$q1",
      returns: "'qualified'",
    },
  },
  compensations: {
    parameters: {
      recipientAddress: {
        type: "address",
        required: true,
      },
      productId: {
        type: "string",
        required: false,
        values: ["https://product1", "https://product2"],
      },
      shippingAddress: {
        type: "string",
        required: false,
      },
    },
    c1: {
      name: "Sugar to your coffee",
      image: "QmbWqxBEKC3P8tqsKc98xmWN33432RLMiMPL8wBuTGsMnR",
      description: "10% discount code for Starbucks",
      requires: "$i1",
      chainId: 1,
      callback: {
        parameters: ["recipientAddress"],
        data: {
          trackingId: "982JJDSLAcx",
        },
      },
    },
  },
});

    
    
   