import { AdContent } from "@objects/businessObjects/AdContent.js";
import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject.js";
import { EAdDisplayType } from "@objects/enum/index.js";
import {
  AdKey,
  EVMContractAddress,
  IpfsCID,
  UnixTimestamp,
} from "@objects/primitives/index.js";
import { PropertiesOf } from "@objects/utilities/index.js";

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

  protected factory(data: PropertiesOf<EligibleAd>): EligibleAd {
    return new EligibleAd(
      data.consentContractAddress,
      data.queryCID,
      data.key,
      data.name,
      data.content,
      data.text,
      data.displayType,
      data.weight,
      data.expiry,
      data.keywords,
    );
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}
