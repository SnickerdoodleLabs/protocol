import {
  DataWalletAddress,
  EVMContractAddress,
  EVMPrivateKey,
  IpfsCID,
  SDQLQuery,
  SDQLString,
} from "@snickerdoodlelabs/objects";

export const dataWalletAddress = DataWalletAddress("dataWalletAddress");

export const dataWalletKey = EVMPrivateKey("dataWalletKey");

export const consentContractAddress = EVMContractAddress(
  "consentContractAddress",
);

export const queryId = IpfsCID("queryId");

export const qureyString = SDQLString("qurey");

export const SDQuery = new SDQLQuery(queryId, qureyString);

// #region for config provider mock

// #endregion
