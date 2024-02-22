import LinkedAccountItem from "@extension-onboarding/components/v2/LinkedAccountItem/LinkedAccountItem";
import { Box } from "@material-ui/core";
import { DiscordProfile } from "@snickerdoodlelabs/objects";
import { SDTypography } from "@snickerdoodlelabs/shared-components";
import React, { FC } from "react";

interface ISocialProps {
  onClick: () => void;
  account: DiscordProfile;
}

const discordImageUrl = "https://cdn.discordapp.com";

const getDiscordAvatar = ({
  avatar,
  discriminator,
  id,
}: DiscordProfile): string => {
  return avatar === null
    ? `${discordImageUrl}/embed/avatars/${Number(discriminator) % 5}.png`
    : `${discordImageUrl}/avatars/${id}/${avatar}.png`;
};

export const Social: FC<ISocialProps> = ({ account, onClick }) => {
  return (
    <LinkedAccountItem
      render={
        <>
          <Box position="relative" width={40} height={40}>
            <img src={getDiscordAvatar(account)} width={40} height={40} />
            <Box
              position="absolute"
              bottom={0}
              right={-6}
              width={16}
              height={16}
            >
              <img
                width="100%"
                src="https://storage.googleapis.com/dw-assets/shared/icons/discord-link.png"
              />
            </Box>
          </Box>
          <SDTypography variant="bodyLg" fontWeight="bold">
            {`${account.username}#${account.discriminator}`}
          </SDTypography>
        </>
      }
      onClick={onClick}
    />
  );
};
