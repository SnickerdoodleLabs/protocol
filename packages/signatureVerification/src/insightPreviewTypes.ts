import { TypedDataField } from "@ethersproject/abstract-signer";

export const insightPreviewTypes: Record<string, TypedDataField[]> = {
  InsightPreview: [
    { name: "consentContractId", type: "address" },
    { name: "queryCID", type: "string" },
    { name: "tokenId", type: "uint256" },
    { name: "possibleInsightsAndAds", type: "string" },
  ],
};
