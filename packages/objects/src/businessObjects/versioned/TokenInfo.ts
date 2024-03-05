import { TokenAddress } from "@objects/businessObjects/TokenAddress.js";
import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject.js";
import { EChain } from "@objects/enum/index.js";
import { TickerSymbol } from "@objects/primitives/index.js";
import { PropertiesOf } from "@objects/utilities/index.js";

export class TokenInfo extends VersionedObject {
  public static CURRENT_VERSION = 1;

  public constructor(
    public id: string,
    public symbol: TickerSymbol,
    public name: string,
    public chain: EChain,
    public address: TokenAddress | null,
    public decimals?: number,
  ) {
    super();
  }

  public getVersion(): number {
    return TokenInfo.CURRENT_VERSION;
  }
}

export class TokenInfoMigrator extends VersionedObjectMigrator<TokenInfo> {
  public getCurrentVersion(): number {
    return TokenInfo.CURRENT_VERSION;
  }

  protected factory(data: PropertiesOf<TokenInfo>): TokenInfo {
    return new TokenInfo(
      data.id,
      data.symbol,
      data.name,
      data.chain,
      data.address,
      data.decimals,
    );
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}
