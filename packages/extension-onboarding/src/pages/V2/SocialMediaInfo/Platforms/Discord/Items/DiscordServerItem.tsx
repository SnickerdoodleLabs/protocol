import { IDiscordServerItem } from "@extension-onboarding/pages/V2/SocialMediaInfo/Platforms/Discord/types";
import { Box } from "@material-ui/core";
import { SDTypography } from "@snickerdoodlelabs/shared-components";
import React, { FC, memo } from "react";

export const DiscordServerItem: FC<IDiscordServerItem> = memo(
  ({ server }: IDiscordServerItem) => {
    const discordImageUrl = "https://cdn.discordapp.com";

    const getDiscordGuildIcon = (): string => {
      return `${discordImageUrl}/icons/${server.id}/${server.icon}.png`;
    };

    return (
      <Box display="flex" alignItems="center">
        <Box mr={2}>
          {!server.icon ? (
            <img width={57} height={57} src={getDiscordGuildIcon()} />
          ) : (
            <Box
              bgcolor="#000"
              alignItems="center"
              display="flex"
              justifyContent="center"
              width={57}
              height={57}
            >
              <SDTypography color="textWhite" align="center">
                {server.name[0]}
              </SDTypography>
            </Box>
          )}
        </Box>
        <Box>
          <Box mb={0.5}>
            <SDTypography
              fontWeight="medium"
              variant="bodyMd"
              color="textHeading"
            >
              {server.name}
            </SDTypography>
          </Box>
          <SDTypography variant="bodySm" color="textSubtitle">
            {server.isOwner ? "Owner" : "Member"}
          </SDTypography>
        </Box>
      </Box>
    );
  },
);
