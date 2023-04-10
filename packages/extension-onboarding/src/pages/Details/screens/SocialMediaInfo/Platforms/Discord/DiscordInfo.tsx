import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import DiscordUnlinkingModal from "@extension-onboarding/components/Modals/DiscordUnlinkingModal";
import { useAccountLinkingContext } from "@extension-onboarding/context/AccountLinkingContext";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import { ISocialMediaPlatformProps } from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/Platforms";
import { useStyles } from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/Platforms/Discord/Discord.style";
import DiscordAccountItem from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/Platforms/Discord/Items/DiscordAccountItem";
import { ILinkedDiscordAccount } from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/Platforms/Discord/types";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { Box, Button, Typography } from "@material-ui/core";
import {
  DiscordProfile,
  OAuthAuthorizationCode,
  SnowflakeID,
} from "@snickerdoodlelabs/objects";
import React, { FC, memo, useEffect, useState } from "react";

declare const window: IWindowWithSdlDataWallet;

const DiscordInfo: FC<ISocialMediaPlatformProps> = ({
  name,
  icon,
}: ISocialMediaPlatformProps) => {
  const [discordProfiles, setDiscordProfiles] = useState<DiscordProfile[]>([]);
  const [linkedDiscordAccount, setLinkedDiscordAccount] = useState<
    ILinkedDiscordAccount[]
  >([]);
  const { setAlert } = useNotificationContext();
  const { discordMediaDataProvider: provider } = useAccountLinkingContext();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProfile, setSelectedProfile] = useState<ILinkedDiscordAccount>(
    {} as ILinkedDiscordAccount,
  );

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

  const initializeUser = (code: string) => {
    provider
      .initializeUserWithAuthorizationCode({
        code: OAuthAuthorizationCode(code),
      })
      .map(() => {
        window.history.replaceState(null, "", window.location.pathname);
        setAlert({
          severity: EAlertSeverity.SUCCESS,
          message: "Your account has successfully been linked. ",
        });
        getUserProfiles();
      });
  };

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) {
      return;
    }
    initializeUser(code);
  }, [JSON.stringify(window.location.search)]);

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

  const classes = useStyles();
  return (
    <>
      {isModalOpen && (
        <DiscordUnlinkingModal
          profileName={`${selectedProfile.name}#${selectedProfile.discriminator}`}
          closeModal={() => {
            setIsModalOpen(false);
          }}
          unlinkAccount={() => {
            provider.unlink(SnowflakeID(selectedProfile.userId)).map(() => {
              getUserProfiles();
              setIsModalOpen(false);
            });
          }}
        />
      )}
      <Box
        p={3}
        display="flex"
        border="1px solid #ECECEC"
        borderRadius={12}
        flexDirection="column"
      >
        <Box
          alignItems="center"
          display="flex"
          width="100%"
          justifyContent="space-between"
        >
          <Box alignItems="center" display="flex">
            <img className={classes.providerLogo} src={icon} />
            <Box ml={2} justifyContent="flex-start" alignItems="center">
              <Typography className={classes.providerName}>{name}</Typography>
            </Box>
          </Box>
          <Box justifyContent="center" alignItems="center">
            <Button
              variant="outlined"
              href={`https://discord.com/oauth2/authorize?response_type=code&client_id=1093307083102887996&scope=identify%20guilds&state=15773059ghq9183habn&redirect_uri=${window.location.origin}/data-dashboard/social-media-data&prompt=consent`}
            >
              Link Account
            </Button>
          </Box>
        </Box>
        {linkedDiscordAccount.map((discordProfile, index) => {
          return (
            <DiscordAccountItem
              key={index}
              handleUnlinkClick={() => {
                setIsModalOpen(true);
                setSelectedProfile(discordProfile);
              }}
              item={discordProfile}
            />
          );
        })}
      </Box>
    </>
  );
};

export default memo(DiscordInfo);
