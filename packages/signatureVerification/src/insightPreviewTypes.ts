import { TypedDataField } from "@ethersproject/abstract-signer";

export const insightPreviewTypes: Record<string, TypedDataField[]> = {
  InsightPreview: [
    { name: "consentContractId", type: "address" },
    { name: "queryCid", type: "string" },
    { name: "dataWallet", type: "address" },
    { name: "queries", type: "string" },
    { name: "parameters", type: "string" },
  ],
};
