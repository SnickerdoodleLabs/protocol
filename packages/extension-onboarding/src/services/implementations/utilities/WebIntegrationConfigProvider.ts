import { IConfigOverrides, URLString } from "@snickerdoodlelabs/objects";

import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { EPathsV2 } from "@extension-onboarding/containers/Router/Router.pathsV2";
import { IWebIntegrationConfigProvider } from "@extension-onboarding/services/interfaces/utilities";

declare const __PRIMARY_INFURA_KEY__: string;
declare const __IFRAME_URL__: string;
declare const __GOOGLE_CLOUD_BUCKET__: string;

export class WebIntegrationConfigProvider
  implements IWebIntegrationConfigProvider
{
  protected config: IConfigOverrides;
  constructor() {
    this.config = {
      primaryInfuraKey:
        typeof __PRIMARY_INFURA_KEY__ === "undefined"
          ? ""
          : __PRIMARY_INFURA_KEY__,
      iframeURL: URLString(
        typeof __IFRAME_URL__ === "undefined" ? "" : __IFRAME_URL__,
      ),
      defaultGoogleCloudBucket:
        typeof __GOOGLE_CLOUD_BUCKET__ === "undefined"
          ? ""
          : __GOOGLE_CLOUD_BUCKET__,
      discordOverrides: {
        oauthRedirectUrl: URLString(
          `${window.location.origin}${EPathsV2.SETTINGS}`,
        ),
      },
      dropboxRedirectUri: URLString(
        `${window.location.origin}${EPathsV2.SETTINGS}`,
      ),
      // @TODO move those env vars
      alchemyApiKeys: {
        Arbitrum: "_G9cUGHUQqvD2ro5zDaTAFXeaTcNgQiF",
        Astar: "Tk2NcwnHwrmRvzZCkqgSr6fOYIgH7xh7",
        Mumbai: "UA7tIJ6CdCE1351h24CQUE-MNCIV3DSf",
        Optimism: "f3mMgv03KKiX8h-pgOc9ZZyu7F9ECcHG",
        Polygon: "el_YkQK0DMQqqGlgXPO5gm8g6WmpdNfX",
        Solana: "pci9xZCiwGcS1-_jWTzi2Z1LqAA7Ikeg",
        SolanaTestnet: "Fko-iHgKEnUKTkM1SvnFMFMw1AvTVAtg",
        Base: "A6Bl1N0M3LKdJEdpqANywIfTEkg5P24X",
      },
      etherscanApiKeys: {
        Ethereum: "6GCDQU7XSS8TW95M9H5RQ6SS4BZS1PY8B7",
        Polygon: "G4XTF3MERFUKFNGANGVY6DTMX1WKAD6V4G",
        Avalanche: "EQ1TUDT41MKJUCBXNDRBCMY4MD5VI9M9G1",
        Binance: "KRWYKPQ3CDD81RXUM5H5UMWVXPJP4C29AY",
        Moonbeam: "EE9QD4D9TE7S7D6C8WVJW592BGMA4HYH71",
        Optimism: "XX9XPVXCBA9VCIQ3YBIZHET5U3BR1DG8B3",
        Arbitrum: "CTJ33WVF49E4UG6EYN6P4KSFC749JPYAFV",
        Gnosis: "J7G8U27J1Y9F88E1E56CNNG2K3H98GF4XE",
        Fuji: "EQ1TUDT41MKJUCBXNDRBCMY4MD5VI9M9G1",
      },
      covalentApiKey: "ckey_ee277e2a0e9542838cf30325665",
      moralisApiKey:
        "aqy6wZJX3r0XxYP9b8EyInVquukaDuNL9SfVtuNxvPqJrrPon07AvWUmlgOvp5ag",
      poapApiKey:
        "wInY1o7pH1yAGBYKcbz0HUIXVHv2gjNTg4v7OQ70hykVdgKlXU3g7GGaajmEarYIX4jxCwm55Oim7kYZeML6wfLJAsm7MzdvlH1k0mKFpTRLXX1AXDIwVQer51SMeuQm",
      ankrApiKey:
        "74bbdfc0dea96f85aadde511a4fe8905342c864202f890ece7d0b8d1c60df637",
      bluezApiKey: "aed4aab2cbc573bbf8e7c6b448c916e5",
      raribleApiKey: "c5855db8-08ef-409f-9947-e46c141af1b4",
      spaceAndTimeKey: "",
      blockvisionKey: "2WaEih5fqe8NUavbvaR2PSuVSSp",

      nftScanApiKey: "lusr87vNmTtHGMmktlFyi4Nt",
      oklinkApiKey: "700c2f71-a4e2-4a85-b87f-58c8a341d1bf",
    };
  }
  getConfig(): IConfigOverrides {
    return this.config;
  }
}
