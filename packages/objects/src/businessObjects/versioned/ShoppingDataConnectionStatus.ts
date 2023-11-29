import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject.js";
import { EKnownDomains } from "@objects/enum";

export class ShoppingDataConnectionStatus extends VersionedObject {
  public static CURRENT_VERSION = 1;
  public constructor(public type: EKnownDomains, public isConnected: boolean) {
    super();
  }
  public getVersion(): number {
    return ShoppingDataConnectionStatus.CURRENT_VERSION;
  }
}

export class ShoppingDataConnectionStatusMigrator extends VersionedObjectMigrator<ShoppingDataConnectionStatus> {
  public getCurrentVersion(): number {
    return ShoppingDataConnectionStatus.CURRENT_VERSION;
  }

  protected amazonMigrator: AmazonMigrator;

  public constructor() {
    super();
    this.amazonMigrator = new AmazonMigrator();
  }

  protected factory(
    data: Record<string, unknown>,
  ): ShoppingDataConnectionStatus {
    switch (data["type"]) {
      case EKnownDomains.Amazon:
        return this.amazonMigrator.factory(data);
    }
    return this.amazonMigrator.factory(data);
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}

export class Amazon extends ShoppingDataConnectionStatus {
  public constructor(public isConnected: boolean) {
    super(EKnownDomains.Amazon, isConnected);
  }
}

export class AmazonMigrator {
  public factory(data: Record<string, unknown>): Amazon {
    return new Amazon(data["isConnected"] as boolean);
  }
}
