import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/VersionedObject";
import { BlockNumber, EVMContractAddress } from "@objects/primitives";

export class LatestBlock extends VersionedObject {
  public static CURRENT_VERSION = 1;

  public constructor(
    public contract: EVMContractAddress,
    public block: BlockNumber,
  ) {
    super();
  }

  public getVersion(): number {
    return LatestBlock.CURRENT_VERSION;
  }
}

export class LatestBlockMigrator extends VersionedObjectMigrator<LatestBlock> {
  public getCurrentVersion(): number {
    return LatestBlock.CURRENT_VERSION;
  }

  protected factory(data: Record<string, unknown>): LatestBlock {
    return new LatestBlock(
      data["contract"] as EVMContractAddress,
      data["block"] as BlockNumber,
    );
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}
