import { useStyles } from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/Platforms/Discord/Discord.style";
import { ILinkedDiscordAccount } from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/Platforms/Discord/types";
import { DiscordServerItem } from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/Platforms/Discord/Items/DiscordServerItem";
import { Box, Button, Grid, Typography } from "@material-ui/core";
import React, { FC, memo } from "react";

interface IDiscordAccountItemProps {
  item: ILinkedDiscordAccount;
  handleUnlinkClick: () => void;
}

export const DiscordAccountItem: FC<IDiscordAccountItemProps> = memo(
  ({
    item: { avatar, userId, discriminator, servers, name },
    handleUnlinkClick,
  }: IDiscordAccountItemProps) => {
    const discordImageUrl = "https://cdn.discordapp.com";
    const classes = useStyles();

    const getDiscordAvatar = (): string => {
      return avatar === null
        ? `${discordImageUrl}/embed/avatars/${Number(discriminator) % 5}.png`
        : `${discordImageUrl}/avatars/${userId}/${avatar}.png`;
    };

    return (
      <Box mt={3} borderRadius={12} border="1px solid #D7D5D5" p={3}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <img
              src={getDiscordAvatar()}
              height={32}
              style={{ borderRadius: "50%" }}
            />
            <Box ml={1.5}>
              <Typography
                className={classes.accountName}
              >{`${name}#${discriminator}`}</Typography>
            </Box>
          </Box>
          <Box>
            <Button
              onClick={handleUnlinkClick}
              className={classes.unlinkAccountButton}
            >
              Unlink Account
            </Button>
          </Box>
        </Box>
        <Box mt={2} mb={3} className={classes.divider} />
        <Box px={2.5}>
          {servers.length > 0 && (
            <>
              <Typography className={classes.guildsTitle}>Servers</Typography>
              <Box my={2} />
              <Grid spacing={3} container>
                {servers.map((server, index) => (
                  <Grid key={index} item xs={6}>
                    <DiscordServerItem server={server} />
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Box>
      </Box>
    );
  },
);
