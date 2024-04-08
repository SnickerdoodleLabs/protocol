import { SpaceAndTimeConfig } from "@objects/businessObjects/index.js";
import { ProviderUrl } from "@objects/primitives/index.js";

export interface IApiKeys {
  primaryInfuraKey: string | null;
  primaryRPCProviderURL: ProviderUrl | null;
  secondaryInfuraKey: string | null;
  secondaryRPCProviderURL: ProviderUrl | null;
  alchemyApiKeys: {
    Arbitrum: string | null;
    Astar: string | null;
    Mumbai: string | null;
    Optimism: string | null;
    Polygon: string | null;
    Solana: string | null;
    SolanaTestnet: string | null;
    Base: string | null;
  };
  etherscanApiKeys: {
    Ethereum: string | null;
    Polygon: string | null;
    Avalanche: string | null;
    Binance: string | null;
    Moonbeam: string | null;
    Optimism: string | null;
    Arbitrum: string | null;
    Gnosis: string | null;
    Fuji: string | null;
  };
  spaceAndTimeCredentials: SpaceAndTimeConfig;
  expandApiKey: string | null;
  covalentApiKey: string | null;
  moralisApiKey: string | null;
  nftScanApiKey: string | null;
  poapApiKey: string | null;
  oklinkApiKey: string | null;
  ankrApiKey: string | null;
  bluezApiKey: string | null;
  raribleApiKey: string | null;
  blockvisionKey: string | null;
}
