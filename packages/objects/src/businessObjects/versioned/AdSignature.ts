import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject";
import {
  IpfsCID,
  AdKey,
  Signature,
  EVMContractAddress,
  JsonWebToken,
} from "@objects/primitives";

export class AdSignature extends VersionedObject {
  public static CURRENT_VERSION = 1;

  public constructor(
    public consentContractAddress: EVMContractAddress,
    public queryCID: IpfsCID,
    public adKey: AdKey,
    public signature: Signature | JsonWebToken,
  ) {
    super();
  }

  public getVersion(): number {
    return AdSignature.CURRENT_VERSION;
  }
}

export class AdSignatureMigrator extends VersionedObjectMigrator<AdSignature> {
  public getCurrentVersion(): number {
    return AdSignature.CURRENT_VERSION;
  }

  protected factory(data: Record<string, unknown>): AdSignature {
    return new AdSignature(
      data["consentContractAddress"] as EVMContractAddress,
      data["queryCID"] as IpfsCID,
      data["adKey"] as AdKey,
      data["signature"] as Signature | JsonWebToken,
    );
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}
