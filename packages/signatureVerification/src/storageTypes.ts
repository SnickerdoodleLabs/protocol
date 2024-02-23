import { TypedDataField } from "ethers";

export const storageTypes: Record<string, TypedDataField[]> = {
  AuthorizationBackup: [{ name: "fileName", type: "string" }],
};
