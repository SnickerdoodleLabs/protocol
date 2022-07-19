import { TypedDataDomain } from "@ethersproject/abstract-signer";

export const snickerdoodleSigningDomain = {
  name: "Snickerdoodle Protocol",
  version: "1",
} as TypedDataDomain;

export * from "@signatureVerification/addCrumbTypes";

// TODO, commented out to compile
//export * from "@signatureVerification/responseTypes";
