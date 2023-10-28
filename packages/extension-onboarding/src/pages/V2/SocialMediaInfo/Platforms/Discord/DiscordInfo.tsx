import Card from "@extension-onboarding/components/v2/Card";
import { useAccountLinkingContext } from "@extension-onboarding/context/AccountLinkingContext";
import { ISocialMediaPlatformProps } from "@extension-onboarding/pages/V2/SocialMediaInfo/Platforms";
import { DiscordAccountItem } from "@extension-onboarding/pages/V2/SocialMediaInfo/Platforms/Discord/Items/DiscordAccountItem";
import { ILinkedDiscordAccount } from "@extension-onboarding/pages/V2/SocialMediaInfo/Platforms/Discord/types";
import { Box } from "@material-ui/core";
import { DiscordProfile } from "@snickerdoodlelabs/objects";
import { SDTypography } from "@snickerdoodlelabs/shared-components";
import React, { FC, memo, useEffect, useState } from "react";
export const DiscordInfo: FC<ISocialMediaPlatformProps> = memo(
  ({ name, icon }: ISocialMediaPlatformProps) => {
    const [discordProfiles, setDiscordProfiles] = useState<DiscordProfile[]>(
      [],
    );
    const [linkedDiscordAccount, setLinkedDiscordAccount] = useState<
      ILinkedDiscordAccount[]
    >([]);
    const { discordProvider: provider } = useAccountLinkingContext();

    const getGuildProfiles = (discordProfiles: DiscordProfile[]) => {
      provider.getGuildProfiles().map((guildProfiles) =>
        setLinkedDiscordAccount(
          discordProfiles.map((discordProfile) => ({
            name: discordProfile.username,
            userId: discordProfile.id,
            avatar: discordProfile.avatar,
            discriminator: discordProfile.discriminator,
            servers: guildProfiles.filter(
              (profile) => profile.discordUserProfileId === discordProfile.id,
            ),
          })),
        ),
      );
    };

    const getUserProfiles = () => {
      provider
        .getUserProfiles()
        .map((discordProfiles) => setDiscordProfiles(discordProfiles));
    };

    useEffect(() => {
      getUserProfiles();
    }, []);

    useEffect(() => {
      if (!discordProfiles) return;
      getGuildProfiles(discordProfiles);
    }, [JSON.stringify(discordProfiles)]);

    return (
      <Card>
        <Box display="flex" flexDirection="column">
          <Box
            alignItems="center"
            display="flex"
            width="100%"
            justifyContent="space-between"
          >
            <Box alignItems="center" display="flex">
              <img width={44} src={icon} />
              <Box ml={2} justifyContent="flex-start" alignItems="center">
                <SDTypography
                  variant="titleLg"
                  fontWeight="bold"
                  color="textHeading"
                >
                  {name}
                </SDTypography>
              </Box>
            </Box>
          </Box>
          {linkedDiscordAccount.map((discordProfile, index) => {
            return <DiscordAccountItem key={index} item={discordProfile} />;
          })}
        </Box>
      </Card>
    );
  },
);
