export enum EWalletDataType {
    Age = 1 << 0,
    Gender = 1 << 1,
    GivenName = 1 << 2,
    FamilyName = 1 << 3,
    Birthday = 1 << 4,
    Email = 1 << 5,
    Location = 1 << 6,
    SiteVisits = 1 << 7,
    EVMTransactions = 1 << 8,
    AccountBalances = 1 << 9,
    AccountNFTs = 1 << 10,
    LatestBlockNumber = 1 << 11,
}