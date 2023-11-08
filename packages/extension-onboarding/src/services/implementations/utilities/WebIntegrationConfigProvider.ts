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
      primaryInfuraKey: __PRIMARY_INFURA_KEY__,
      iframeURL: URLString(__IFRAME_URL__),
      defaultGoogleCloudBucket: __GOOGLE_CLOUD_BUCKET__,
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

      // passing the bearer token as the key
      spaceAndTimeKey:
        "eyJ0eXBlIjoiYWNjZXNzIiwia2lkIjoiZTUxNDVkYmQtZGNmYi00ZjI4LTg3NzItZjVmNjNlMzcwM2JlIiwiYWxnIjoiRVMyNTYifQ.eyJpYXQiOjE2OTkzNzIzOTIsIm5iZiI6MTY5OTM3MjM5MiwiZXhwIjoxNjk5MzczODkyLCJ0eXBlIjoiYWNjZXNzIiwidXNlciI6ImFuZHJld0Bzbmlja2VyZG9vZGxlbGFicy5pbyIsInNlc3Npb24iOiIzNjFkZDgwYzVkZjI3YzQ5ZjBhOTI2MTciLCJzc25fZXhwIjoxNjk5NDU4NzkyNDQxLCJpdGVyYXRpb24iOiJmOTE5M2Q0YTAyNzU0NWQ0ODJjYmZhMDIiLCJ0cmlhbCI6dHJ1ZX0.sciVPEWLH5Z3h6CK-3Zgnnh0VrtSwBa9z5b6zQi2FR0A50YAWYnN9gdzeC46mfNwNXrGp6mcIbEBImRmgFYtnQ",

      blockvisionKey: "2WaEih5fqe8NUavbvaR2PSuVSSp",

      nftScanApiKey: "lusr87vNmTtHGMmktlFyi4Nt",
      oklinkApiKey: "700c2f71-a4e2-4a85-b87f-58c8a341d1bf",
    };
  }
  getConfig(): IConfigOverrides {
    return this.config;
  }
}
