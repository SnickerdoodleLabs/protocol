import { TickerSymbol, URLString } from "@objects/primitives/index.js";

export class TokenMarketData {
  public constructor(
    public id: string,
    public symbol: TickerSymbol,
    public name: string,
    public image: URLString,
    public currentPrice: number,
    public marketCap: number,
    public marketCapRank: number,
    public priceChange24h: number,
    public priceChangePercentage24h: number,
    public circulatingSupply: number,
    public totalSupply: number,
    public maxSupply: number | null,
  ) {}
}
