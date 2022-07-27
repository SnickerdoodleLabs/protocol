import { TypedDataField } from "@ethersproject/abstract-signer";

export const executeMetatransactionTypes: Record<string, TypedDataField[]> = {
  ExecuteMetatransaction: [
    { name: "accountAddress", type: "address" },
    { name: "contractAddress", type: "address" },
    { name: "nonce", type: "uint256" },
    { name: "data", type: "bytes" },
    { name: "metatransactionSignature", type: "string" },
  ],
};
