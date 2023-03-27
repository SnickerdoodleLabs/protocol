//@ts-ignore
import DiscordIcon from "@extension-onboarding/assets/icons/discord.svg";

import { ESocialMediaProviderKeys } from "@extension-onboarding/constants";
import {
  DiscordProvider,
} from "@extension-onboarding/services/socialMediaDataProviders/connectors";
import { ISocialMediaDataProvider } from "@extension-onboarding/services/socialMediaDataProviders/interfaces";

export interface ISocialMediaProvider {
  provider: ISocialMediaDataProvider;
  icon: any;
  name: string;
  key: ESocialMediaProviderKeys;

}


export const getProviderList = (): ISocialMediaProvider[] => {
  return [
    {
      provider: new DiscordProvider(),
      icon: DiscordIcon,
      name: "Discord",
      key: ESocialMediaProviderKeys.DISCORD,
    },
  ];
};
