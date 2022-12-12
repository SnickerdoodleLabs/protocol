import { TypedDataField } from "@ethersproject/abstract-signer";

export const cloudBackupTypes: Record<string, TypedDataField[]> = {
  CloudBackup: [{ name: "fileName", type: "string" }],
};
