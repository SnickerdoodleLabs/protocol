import LinkedAccountItem from "@extension-onboarding/components/v2/LinkedAccountItem/LinkedAccountItem";
import { Box } from "@material-ui/core";
import { DiscordProfile } from "@snickerdoodlelabs/objects";
import {
  SDTypography,
  colors,
  useResponsiveValue,
} from "@snickerdoodlelabs/shared-components";
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
  const getResponsiveValue = useResponsiveValue();
  return (
    <LinkedAccountItem
      render={
        <>
          <Box
            position="relative"
            width={{ xs: 22, sm: 40 }}
            height={{ xs: 22, sm: 40 }}
          >
            <img
              src={getDiscordAvatar(account)}
              width={getResponsiveValue({ xs: 22, sm: 40 })}
              height={getResponsiveValue({ xs: 22, sm: 40 })}
            />
            <Box
              position="absolute"
              bottom={0}
              right={{ xs: -3, sm: -6 }}
              width={{ xs: 10, sm: 16 }}
              height={{ xs: 10, sm: 16 }}
            >
              <img
                width="100%"
                src="https://storage.googleapis.com/dw-assets/shared/icons/discord-link.png"
              />
            </Box>
          </Box>
          <SDTypography
            hexColor={colors.DARKPURPLE500}
            variant="bodyLg"
            fontWeight="bold"
          >
            {`${account.username}#${account.discriminator}`}
          </SDTypography>
        </>
      }
      onClick={onClick}
    />
  );
};
