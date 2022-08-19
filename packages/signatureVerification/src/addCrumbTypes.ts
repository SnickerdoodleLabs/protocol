import { TypedDataField } from "@ethersproject/abstract-signer";

export const addCrumbTypes: Record<string, TypedDataField[]> = {
  AddCrumb: [
    { name: "accountAddress", type: "address" },
    { name: "data", type: "string" },
    { name: "initializationVector", type: "string" },
    { name: "languageCode", type: "string" },
  ],
};
