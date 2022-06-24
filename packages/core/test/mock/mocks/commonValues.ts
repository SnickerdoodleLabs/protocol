import {
  DataWalletAddress,
  EthereumContractAddress,
  EthereumPrivateKey,
  IpfsCID,
  SDQLQuery,
  SDQLString,
} from "@snickerdoodlelabs/objects";

export const dataWalletAddress = DataWalletAddress("dataWalletAddress");

export const dataWalletKey = EthereumPrivateKey("dataWalletKey");

export const consentContractAddress = EthereumContractAddress(
  "consentContractAddress",
);

export const queryId = IpfsCID("queryId");

export const qureyString = SDQLString("qurey");

export const SDQuery = new SDQLQuery(queryId, qureyString);
