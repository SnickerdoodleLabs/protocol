import {
  TokenAddress,
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects";
import { EChain } from "@objects/enum";
import { TickerSymbol, URLString } from "@objects/primitives";

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

  protected factory(data: Record<string, unknown>): TokenInfo {
    return new TokenInfo(
      data["id"] as string,
      data["symbol"] as TickerSymbol,
      data["name"] as string,
      data["chain"] as EChain,
      data["address"] as TokenAddress,
      data["decimals"] as number,
    );
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}
