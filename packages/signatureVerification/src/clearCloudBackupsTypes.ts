import { TypedDataField } from "@ethersproject/abstract-signer";

export const clearCloudBackupsTypes: Record<string, TypedDataField[]> = {
  clearCloudBackups: [{ name: "walletAddress", type: "address" }],
};
