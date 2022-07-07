import { TypedDataDomain } from "@ethersproject/abstract-signer";

export const snickerdoodleSigningDomain = {
  name: "Snickerdoodle Protocol",
  version: "1",
} as TypedDataDomain;

export * from "@signatureVerification/addCrumbTypes";
