import { EWalletDataType } from "@objects/enum/index.js";
import { QueryTypes } from "@objects/primitives/QueryTypes.js";

export const QueryTypePermissionMap = new Map<QueryTypes, EWalletDataType>([
  // web2
  ["age", EWalletDataType.Age],
  ["birthday", EWalletDataType.Birthday],
  ["email", EWalletDataType.Email],
  ["familyName", EWalletDataType.FamilyName],
  ["gender", EWalletDataType.Gender],
  ["givenName", EWalletDataType.GivenName],
  ["location", EWalletDataType.Location],
  ["url_visited_count", EWalletDataType.SiteVisits],
  ["social_discord", EWalletDataType.Discord],
  ["social_twitter", EWalletDataType.Twitter],
  // web3
  ["balance", EWalletDataType.AccountBalances],
  ["nft", EWalletDataType.AccountNFTs],
  ["network", EWalletDataType.EVMTransactions],
  ["chain_transactions", EWalletDataType.EVMTransactions],
  ["web3_account", EWalletDataType.AccountSize],
]);
