//@ts-ignore
import DiscordIcon from "@extension-onboarding/assets/icons/discord.svg";

import { ESocialMediaProviderKeys } from "@extension-onboarding/constants";
import { DiscordProvider } from "@extension-onboarding/services/socialMediaProviders/implementations";
import { ISocialMediaProvider } from "@extension-onboarding/services/socialMediaProviders/interfaces";

export interface ISocialMediaWrapper {
  provider: ISocialMediaProvider;
  icon: any;
  name: string;
  key: ESocialMediaProviderKeys;
}

export const getProviderList = (): ISocialMediaWrapper[] => [
  {
    provider: new DiscordProvider(),
    icon: DiscordIcon,
    name: "Discord",
    key: ESocialMediaProviderKeys.DISCORD,
  },
];
