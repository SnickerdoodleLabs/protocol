import { TypedDataField } from "@ethersproject/abstract-signer";

export const insightDeliveryTypes: Record<string, TypedDataField[]> = {
  InsightDelivery: [
    { name: "consentContractId", type: "address" },
    { name: "queryCID", type: "string" },
    { name: "dataWallet", type: "address" },
    { name: "returns", type: "string" },
    { name: "rewardParameters", type: "string" },
  ],
};
