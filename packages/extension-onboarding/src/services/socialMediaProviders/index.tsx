import { ESocialType, ISdlDataWallet } from "@snickerdoodlelabs/objects";
import { DiscordProvider } from "@extension-onboarding/services/socialMediaProviders/implementations";
import { ISocialMediaProvider } from "@extension-onboarding/services/socialMediaProviders/interfaces"
export interface ISocialMediaWrapper {
  provider: ISocialMediaProvider;
  icon: string;
  name: string;
  key: ESocialType;
}

export const getProviderList = (
  sdlDataWallet: ISdlDataWallet,
): ISocialMediaWrapper[] => [
  {
    provider: new DiscordProvider(sdlDataWallet),
    icon: "https://storage.googleapis.com/dw-assets/shared/icons/discord-link.png",
    name: "Discord",
    key: ESocialType.DISCORD,
  },
];
