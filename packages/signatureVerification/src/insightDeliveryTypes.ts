import { TypedDataField } from "@ethersproject/abstract-signer";

export const insightDeliveryTypes: Record<string, TypedDataField[]> = {
  InsightDelivery: [
    { name: "consentContractId", type: "address" },
    { name: "queryCID", type: "string" },
    { name: "tokenId", type: "uint256" },
    { name: "insights", type: "string" },
    { name: "rewardParameters", type: "string" },
  ],
};
