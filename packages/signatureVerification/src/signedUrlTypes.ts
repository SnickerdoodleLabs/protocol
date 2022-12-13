import { TypedDataField } from "@ethersproject/abstract-signer";

export const signedUrlTypes: Record<string, TypedDataField[]> = {
  SignedUrl: [{ name: "fileName", type: "string" }],
};
