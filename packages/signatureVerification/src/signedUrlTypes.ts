import { TypedDataField } from "ethers";

export const signedUrlTypes: Record<string, TypedDataField[]> = {
  SignedUrl: [{ name: "fileName", type: "string" }],
};
