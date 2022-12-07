import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { ChainId, EVMContractAddress } from "@snickerdoodlelabs/objects";

export const snickerdoodleSigningDomain = {
  name: "Snickerdoodle Protocol",
  version: "1",
} as TypedDataDomain;

export function getMinimalForwarderSigningDomain(
  chainId: ChainId,
  forwarderContractAddress: EVMContractAddress,
): TypedDataDomain {
  return {
    name: "MinimalForwarder",
    version: "0.0.1",
    chainId: chainId,
    verifyingContract: forwarderContractAddress,
  };
}

export * from "@signatureVerification/addCrumbTypes";
export * from "@signatureVerification/authorizationBackupTypes";
export * from "@signatureVerification/executeMetatransactionTypes";
export * from "@signatureVerification/forwardRequestTypes";
export * from "@signatureVerification/insightDeliveryTypes";
export * from "@signatureVerification/insightPreviewTypes";
