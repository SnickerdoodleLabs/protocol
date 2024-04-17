import Card from "@extension-onboarding/components/v2/Card";
import { DiscordServerItem } from "@extension-onboarding/pages/V2/SocialMediaInfo/Platforms/Discord/Items/DiscordServerItem";
import { ILinkedDiscordAccount } from "@extension-onboarding/pages/V2/SocialMediaInfo/Platforms/Discord/types";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import { SDTypography } from "@snickerdoodlelabs/shared-components";
import React, { FC, memo } from "react";

interface IDiscordAccountItemProps {
  item: ILinkedDiscordAccount;
}

export const DiscordAccountItem: FC<IDiscordAccountItemProps> = memo(
  ({
    item: { avatar, userId, discriminator, servers, name },
  }: IDiscordAccountItemProps) => {
    const discordImageUrl = "https://cdn.discordapp.com";

    const getDiscordAvatar = (): string => {
      return avatar === null
        ? `${discordImageUrl}/embed/avatars/${Number(discriminator) % 5}.png`
        : `${discordImageUrl}/avatars/${userId}/${avatar}.png`;
    };

    return (
      <>
        <Box mt={3} />
        <Card>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center">
              <img
                src={getDiscordAvatar()}
                height={32}
                style={{ borderRadius: "50%" }}
              />
              <Box ml={1.5}>
                <SDTypography
                  variant="bodyMd"
                  color="textHeading"
                  style={{ textTransform: "uppercase" }}
                >
                  {`${name}#${discriminator}`}
                </SDTypography>
              </Box>
            </Box>
          </Box>
          <Box mt={2} />
          <Divider />
          <Box mt={2} px={2.5}>
            {servers.length > 0 && (
              <>
                <SDTypography
                  variant="bodyLg"
                  fontWeight="medium"
                  color="textHeading"
                >
                  Servers
                </SDTypography>
                <Box my={2} />
                <Grid spacing={3} container>
                  {servers.map((server, index) => (
                    <Grid key={index} item xs={12} sm={6}>
                      <DiscordServerItem server={server} />
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </Box>
        </Card>
      </>
    );
  },
);
