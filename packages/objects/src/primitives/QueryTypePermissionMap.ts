import { EWalletDataType } from "@objects/enum/EWalletDataType";
import { QueryTypes } from "@objects/primitives/QueryTypes";

export const QueryTypePermissionMap = new Map<QueryTypes, EWalletDataType>([
  // web2
  ["age", EWalletDataType.Age],
  ["birthday", EWalletDataType.Birthday],
  ["chain_transactions", EWalletDataType.EVMTransactions],
  ["email", EWalletDataType.Email],
  ["familyName", EWalletDataType.FamilyName],
  ["gender", EWalletDataType.Gender],
  ["givenName", EWalletDataType.GivenName],
  ["location", EWalletDataType.Location],
  ["url_visited_count", EWalletDataType.SiteVisits],
  ["social_discord", EWalletDataType.Discord],
  // web3
  ["nft", EWalletDataType.AccountNFTs],
  ["network", EWalletDataType.EVMTransactions],
]);
