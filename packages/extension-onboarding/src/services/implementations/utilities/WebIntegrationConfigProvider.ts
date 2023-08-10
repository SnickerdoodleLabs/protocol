import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { IWebIntegrationConfigProvider } from "@extension-onboarding/services/interfaces/utilities";
import { IConfigOverrides, URLString } from "@snickerdoodlelabs/objects";

declare const __PRIMARY_INFURA_KEY__: string;
declare const __IFRAME_URL__: string;

export class WebIntegrationConfigProvider
  implements IWebIntegrationConfigProvider
{
  protected config: IConfigOverrides;
  constructor() {
    this.config = {
      primaryInfuraKey: __PRIMARY_INFURA_KEY__,
      iframeURL: URLString(__IFRAME_URL__),
      discordOverrides: {
        oauthRedirectUrl: URLString(
          `${window.location.origin}${EPaths.SOCIAL_MEDIA_DATA}`,
        ),
      },
    };
  }
  getConfig(): IConfigOverrides {
    return this.config;
  }
}
