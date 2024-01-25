import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject.js";
import {
  IpfsCID,
  AdKey,
  Signature,
  EVMContractAddress,
  JsonWebToken,
} from "@objects/primitives/index.js";
import { PropertiesOf } from "@objects/utilities/index.js";

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

  protected factory(data: PropertiesOf<AdSignature>): AdSignature {
    return new AdSignature(
      data.consentContractAddress,
      data.queryCID,
      data.adKey,
      data.signature,
    );
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}
