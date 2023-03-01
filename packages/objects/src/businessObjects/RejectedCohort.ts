import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/VersionedObject";
import { EVMContractAddress } from "@objects/primitives";

export class RejectedCohort extends VersionedObject {
  public static CURRENT_VERSION = 1;

  public constructor(public consentContractAddress: EVMContractAddress) {
    super();
  }

  public getVersion(): number {
    return RejectedCohort.CURRENT_VERSION;
  }
}

export class RejectedCohortMigrator extends VersionedObjectMigrator<RejectedCohort> {
  public getCurrentVersion(): number {
    return RejectedCohort.CURRENT_VERSION;
  }

  protected factory(data: Record<string, unknown>): RejectedCohort {
    return new RejectedCohort(
      data["consentContractAddress"] as EVMContractAddress,
    );
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}
