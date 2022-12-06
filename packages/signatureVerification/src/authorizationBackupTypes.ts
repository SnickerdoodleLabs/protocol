import { TypedDataField } from "@ethersproject/abstract-signer";

export const authorizationBackupTypes: Record<string, TypedDataField[]> = {
  AuthorizationBackup: [{ name: "fileName", type: "string" }],
};
