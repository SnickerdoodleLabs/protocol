export const web2QueryTypes = [
  "age",
  "gender",
  "givenName",
  "familyName",
  "birthday",
  "email",
  "location",
  "browsing_history",
  "url_visited_count",
  "chain_transactions",
] as const;
export type Web2QueryTypes = (typeof web2QueryTypes)[number];

export const web3QueryTypes = ["nft", "network", "balance"] as const;
export type Web3QueryTypes = (typeof web3QueryTypes)[number];

export type QueryTypes = Web2QueryTypes | Web3QueryTypes;
