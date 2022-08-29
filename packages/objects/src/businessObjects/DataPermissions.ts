import { EWalletDataType } from "@objects/enum/EWalletDataType";

/**
 * DataPermissions represent the rules to follow when processing queries for a particular
 * cohort. They are basically auto-reject rules to follow that are baked into the consent
 * token itself in the Token URI.
 */
export class DataPermissions {
  public constructor(readonly flags: number) {
    
  }

  public getFlags(): number {
    return this.flags
  }

  public eq(otherFlags: number): boolean {
    return this.flags === otherFlags;
  }

  public contains(other: DataPermissions): boolean {
    return (this.flags & other.getFlags()) == other.flags;
  }


  public get Age(): boolean {
    return (this.flags & EWalletDataType.Age) > 0;
  }
  public get Gender(): boolean {
    return (this.flags & EWalletDataType.Gender) > 0;
  }
  public get GivenName(): boolean {
    return (this.flags & EWalletDataType.GivenName) > 0;
  }
  public get FamilyName(): boolean {
    return (this.flags & EWalletDataType.FamilyName) > 0;
  }
  public get Birthday(): boolean {
    return (this.flags & EWalletDataType.Birthday) > 0;
  }
  public get Email(): boolean {
    return (this.flags & EWalletDataType.Email) > 0;
  }
  public get Location(): boolean {
    return (this.flags & EWalletDataType.Location) > 0;
  }
  public get SiteVisits(): boolean {
    return (this.flags & EWalletDataType.SiteVisits) > 0;
  }
  public get EVMTransactions(): boolean {
    return (this.flags & EWalletDataType.EVMTransactions) > 0;
  }
  public get AccountBalances(): boolean {
    return (this.flags & EWalletDataType.AccountBalances) > 0;
  }
  public get AccountNFTs(): boolean {
    return (this.flags & EWalletDataType.AccountNFTs) > 0;
  }
  public get LatestBlockNumber(): boolean {
    return (this.flags & EWalletDataType.LatestBlockNumber) > 0;
  }
}
