import { TypedDataField } from "ethers";

export const clearCloudBackupsTypes: Record<string, TypedDataField[]> = {
  clearCloudBackups: [{ name: "walletAddress", type: "address" }],
};
