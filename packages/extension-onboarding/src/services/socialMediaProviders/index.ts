//@ts-ignore
import DiscordIcon from "@extension-onboarding/assets/icons/discord.svg";

import { ESocialMediaProviderKeys } from "@extension-onboarding/constants";
import { ISocialMediaProvider } from "@extension-onboarding/services/socialMediaProviders/interfaces";
import { DiscordProvider } from "@extension-onboarding/services/socialMediaProviders/providers";

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
