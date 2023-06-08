import { TokenAddress } from "@objects/businessObjects/TokenAddress";
import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject";
import { EChain, ERecordKey } from "@objects/enum";
import { TickerSymbol, VolatileStorageKey } from "@objects/primitives";

export class TokenInfo extends VersionedObject {
  public pKey: string;

  public constructor(
    public id: string,
    public symbol: TickerSymbol,
    public name: string,
    public chain: EChain,
    public address: TokenAddress | null,
    public decimals?: number,
  ) {
    super();
    this.pKey = TokenInfo.getKey(this.chain, this.address);
  }

  public static CURRENT_VERSION = 1;
  public getVersion(): number {
    return TokenInfo.CURRENT_VERSION;
  }

  public static getKey(chain: EChain, address: TokenAddress | null): string {
    return `${chain}_${address}`;
  }
}

export class TokenInfoMigrator extends VersionedObjectMigrator<TokenInfo> {
  public getCurrentVersion(): number {
    return TokenInfo.CURRENT_VERSION;
  }

  public factory(data: Record<string, unknown>): TokenInfo {
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

export class RealmTokenInfo extends Realm.Object<RealmTokenInfo> {
  pKey!: string;
  symbol!: string;
  name!: string;
  chain!: number;
  address!: string;
  decimals!: number;

  static schema = {
    name: ERecordKey.COIN_INFO,
    properties: {
      pKey: "string",
      symbol: "string",
      name: "string",
      chain: "int",
      address: "string",
      decimals: "int",
    },
    primaryKey: "pKey",
  };
}
