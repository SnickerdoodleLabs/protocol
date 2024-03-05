export const web2QueryTypes = [
  "age",
  "gender",
  "givenName",
  "familyName",
  "birthday",
  "email",
  "location",
  "url_visited_count",
  "social_discord",
  "social_twitter",
  "questionnaire",
] as const;
export type Web2QueryTypes = (typeof web2QueryTypes)[number];

export const web3QueryTypes = [
  "nft",
  "network",
  "balance",
  "chain_transactions",
  "web3_account",
] as const;
export type Web3QueryTypes = (typeof web3QueryTypes)[number];

export type QueryTypes = Web2QueryTypes | Web3QueryTypes;
