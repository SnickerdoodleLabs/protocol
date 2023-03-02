import { TypedDataField } from "@ethersproject/abstract-signer";

export const storageTypes: Record<string, TypedDataField[]> = {
  AuthorizationBackup: [{ name: "fileName", type: "string" }],
};
