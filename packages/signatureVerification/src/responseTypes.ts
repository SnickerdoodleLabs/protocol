import { TypedDataField } from "@ethersproject/abstract-signer";

export const responseTypes: Record<string, TypedDataField[]> = {
  Return: [
    { name: "subquery", type: "string" },
    /* double format is not supported by the ethers 
      see: https://eips.ethereum.org/EIPS/eip-712#definition-of-typed-structured-data-%F0%9D%95%8A
    */
    { name: "data", type: "uint32[]" },
  ],
  Response: [
    { name: "consentContractId", type: "address" },
    { name: "queryId", type: "string" },
    { name: "dataWallet", type: "address" },
    { name: "returns", type: "Return[]" },
  ],
};
