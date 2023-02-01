import {
  AdContent,
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects";
import {
  AdKey,
  EVMContractAddress,
  IpfsCID,
  UnixTimestamp,
  EAdDisplayType,
} from "@objects/primitives";

export class EligibleAd extends VersionedObject {
  public static CURRENT_VERSION = 1;

  public constructor(
    public consentContractAddress: EVMContractAddress,
    public queryCID: IpfsCID,
    public key: AdKey, // 'a1'
    public name: string,
    public content: AdContent,
    public text: string | null,
    public displayType: EAdDisplayType,
    public weight: number,
    public expiry: UnixTimestamp,
    public keywords: string[],
  ) {
    super();
  }

  public getUniqueId(): string {
    return this.queryCID + this.key;
  }

  public getVersion(): number {
    return EligibleAd.CURRENT_VERSION;
  }
}

export class EligibleAdMigrator extends VersionedObjectMigrator<EligibleAd> {
  public getCurrentVersion(): number {
    return EligibleAd.CURRENT_VERSION;
  }

  protected factory(data: Record<string, unknown>): EligibleAd {
    return new EligibleAd(
      data["consentContractAddress"] as EVMContractAddress,
      data["queryCID"] as IpfsCID,
      data["key"] as AdKey,
      data["name"] as string,
      data["content"] as AdContent,
      data["text"] as string,
      data["displayType"] as EAdDisplayType,
      data["weight"] as number,
      data["expiry"] as UnixTimestamp,
      data["keywords"] as string[],
    );
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}
