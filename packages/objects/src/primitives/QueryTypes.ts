export const web2QueryTypes = [
  "age",
  "gender",
  "givenName",
  "familyName",
  "birthday",
  "email",
  "location",
  "url_visited_count",
  "chain_transactions",
  "social_discord",
] as const;
export type Web2QueryTypes = (typeof web2QueryTypes)[number];

export const web3QueryTypes = ["nft", "network"] as const;
export type Web3QueryTypes = (typeof web3QueryTypes)[number];

export type QueryTypes = Web2QueryTypes | Web3QueryTypes;

