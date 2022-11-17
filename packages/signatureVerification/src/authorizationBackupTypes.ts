import { TypedDataField } from "@ethersproject/abstract-signer";

export const authorizationBackupTypes: Record<string, TypedDataField[]> = {
  AuthorizationBackup: [
    { name: "dataWallet", type: "address" },
    { name: "fileName", type: "string" },
  ],
};
