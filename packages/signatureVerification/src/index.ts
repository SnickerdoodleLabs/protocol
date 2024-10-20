import { ChainId, EVMContractAddress } from "@snickerdoodlelabs/objects";
import { TypedDataDomain } from "ethers";

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
export * from "@signatureVerification/clearCloudBackupsTypes";
export * from "@signatureVerification/signedUrlTypes";
export * from "@signatureVerification/executeMetatransactionTypes";
export * from "@signatureVerification/forwardRequestTypes";
export * from "@signatureVerification/insightDeliveryTypes";
export * from "@signatureVerification/insightPreviewTypes";
