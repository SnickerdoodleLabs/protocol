import { Box, CircularProgress, Dialog } from "@material-ui/core";
import {
  CountryCode,
  DiscordProfile,
  EarnedReward,
  ENotificationTypes,
  ESocialType,
  EWalletDataType,
  Gender,
  PossibleReward,
  TNotification,
  TwitterProfile,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import {
  PermissionSelection,
  UI_SUPPORTED_PERMISSIONS,
} from "@snickerdoodlelabs/shared-components";
import { useStyles } from "@synamint-extension-sdk/content/components/Screens/Permissions/Permissions.style";
import { ExternalCoreGateway } from "@synamint-extension-sdk/gateways";
import {
  IInvitationDomainWithUUID,
  IExtensionConfig,
  PORT_NOTIFICATION,
} from "@synamint-extension-sdk/shared";
import {
  GetPossibleRewardsParams,
  SetBirthdayParams,
  SetGenderParams,
  SetLocationParams,
} from "@synamint-extension-sdk/shared/interfaces/actions.js";
import { UpdatableEventEmitterWrapper } from "@synamint-extension-sdk/utils";
import { JsonRpcError } from "json-rpc-engine";
import { ResultAsync, okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import React, { FC, useCallback, useEffect, useState } from "react";

interface IPermissionsProps {
  coreGateway: ExternalCoreGateway;
  domainDetails: IInvitationDomainWithUUID;
  config: IExtensionConfig;
  onCancelClick: () => void;
  eventEmitter: UpdatableEventEmitterWrapper;
  isUnlocked: boolean;
  onNextClick: (
    eligibleRewards: PossibleReward[],
    missingRewards: PossibleReward[],
    dataTypes: EWalletDataType[],
  ) => void;
}

const Permissions: FC<IPermissionsProps> = ({
  coreGateway,
  domainDetails,
  onCancelClick,
  onNextClick,
  config,
  eventEmitter,
  isUnlocked,
}) => {
  const classes = useStyles();
  const [profileValues, setProfileValues] = useState<{
    date_of_birth: UnixTimestamp | null;
    gender: Gender | null;
    country_code: CountryCode | null;
  }>();
  const [socialProfileValues, setSocialProfileValues] = useState<{
    discordProfiles: DiscordProfile[];
    twitterProfiles: TwitterProfile[];
  }>({ discordProfiles: [], twitterProfiles: [] });
  const [rewards, setRewards] = useState<{
    earnedRewards: EarnedReward[];
    possibleRewards: PossibleReward[];
  }>();

  useEffect(() => {
    getRewards();
  }, []);

  useEffect(() => {
    if (isUnlocked) {
      getRewards();
      getProfileValues();
      getSocialProfileValues();
      eventEmitter.on(PORT_NOTIFICATION, handleNotification);
    }
    return () => {
      eventEmitter.off(PORT_NOTIFICATION, handleNotification);
    };
  }, [isUnlocked]);

  const handleNotification = (notificaton: TNotification) => {
    switch (notificaton.type) {
      case ENotificationTypes.SOCIAL_PROFILE_LINKED: {
        return getSocialProfileValues();
      }
      case ENotificationTypes.PROFILE_FIELD_CHANGED: {
        return getProfileValues();
      }
      default:
        return;
    }
  };

  const getProfileValues = () => {
    return ResultUtils.combine([
      coreGateway.getBirtday(),
      coreGateway.getGender(),
      coreGateway.getLocation(),
    ]).map(([date_of_birth, gender, country_code]) => {
      const values = { date_of_birth, gender, country_code };
      setProfileValues(values);
      return values;
    });
  };

  const getSocialProfileValues = () => {
    return ResultUtils.combine([
      coreGateway.discord.getUserProfiles(),
      coreGateway.twitter.getUserProfiles(),
    ]).map(([discordProfiles, twitterProfiles]) => {
      const values = { discordProfiles, twitterProfiles };
      setSocialProfileValues(values);
      return values;
    });
  };

  const getRewards = useCallback(() => {
    return ResultUtils.combine([
      isUnlocked
        ? coreGateway.getEarnedRewards()
        : (okAsync([]) as ResultAsync<EarnedReward[], JsonRpcError>),
      coreGateway.getPossibleRewards(
        new GetPossibleRewardsParams([domainDetails.consentAddress]),
      ),
    ]).map(([earnedRewards, possibleRewardsRec]) => {
      setRewards({
        earnedRewards,
        possibleRewards: possibleRewardsRec[domainDetails.consentAddress] ?? [],
      });
    });
  }, [isUnlocked]);

  const generateAllPermissions = useCallback((): ResultAsync<
    EWalletDataType[],
    unknown
  > => {
    let permissions = UI_SUPPORTED_PERMISSIONS;
    return ResultUtils.combine([
      profileValues ? okAsync(profileValues) : getProfileValues(),
      socialProfileValues
        ? okAsync(socialProfileValues)
        : getSocialProfileValues(),
    ]).map(([pValues, sValues]) => {
      if (!pValues.date_of_birth) {
        permissions = permissions.filter((item) => item != EWalletDataType.Age);
      }
      if (!pValues.gender) {
        permissions = permissions.filter(
          (item) => item != EWalletDataType.Gender,
        );
      }
      if (!pValues.country_code) {
        permissions = permissions.filter(
          (item) => item != EWalletDataType.Location,
        );
      }
      if (!sValues.discordProfiles.length) {
        permissions = permissions.filter(
          (item) => item != EWalletDataType.Discord,
        );
      }
      if (!sValues.twitterProfiles.length) {
        permissions = permissions.filter(
          (item) => item != EWalletDataType.Twitter,
        );
      }
      return permissions;
    });
  }, [JSON.stringify(profileValues), JSON.stringify(socialProfileValues)]);

  const isSafe = useCallback(
    (dataType: EWalletDataType) => {
      switch (dataType) {
        case EWalletDataType.Age:
          return !!profileValues?.date_of_birth;
        case EWalletDataType.Location:
          return !!profileValues?.country_code;
        case EWalletDataType.Gender:
          return !!profileValues?.gender;
        case EWalletDataType.Discord:
          return !!socialProfileValues?.discordProfiles.length;
        case EWalletDataType.Twitter:
          return !!socialProfileValues?.twitterProfiles.length;
        default:
          return true;
      }
    },
    [JSON.stringify(profileValues), JSON.stringify(socialProfileValues)],
  );

  const onSocialClick = (socialType: ESocialType) => {
    switch (socialType) {
      case ESocialType.DISCORD: {
        return coreGateway.discord.installationUrl().map((url) => {
          window.open(url, "_blank");
        });
      }
      case ESocialType.TWITTER: {
        // @TODO: implement installation url for twitter
        return coreGateway.twitter
          .getOAuth1aRequestToken()
          .map((tokenAndSecret) => {
            window.open(
              `https://api.twitter.com/oauth/authorize?oauth_token=${tokenAndSecret.token}&oauth_token_secret=${tokenAndSecret.secret}&oauth_callback_confirmed=true`,
              "_blank",
            );
          });
      }
      default:
        return;
    }
  };

  return (
    <Dialog
      className={classes.container}
      open={true}
      disableEnforceFocus
      disablePortal
      maxWidth="lg"
      fullWidth
    >
      {rewards ? (
        <PermissionSelection
          setBirthday={(birthday) =>
            coreGateway.setBirtday(new SetBirthdayParams(birthday))
          }
          setLocation={(location: CountryCode) =>
            coreGateway.setLocation(new SetLocationParams(location))
          }
          setGender={(gender: Gender) =>
            coreGateway.setGender(new SetGenderParams(gender))
          }
          generateAllPermissions={generateAllPermissions}
          isSafe={isSafe}
          consentContractAddress={domainDetails.consentAddress}
          campaignInfo={domainDetails}
          possibleRewards={rewards.possibleRewards}
          earnedRewards={rewards.earnedRewards}
          onCancelClick={onCancelClick}
          onAcceptClick={onNextClick}
          ipfsBaseUrl={config.ipfsFetchBaseUrl}
          isUnlocked={isUnlocked}
          onPermissionClickWhenLocked={() => {
            window.open(`${config.onboardingUrl}?action=linkAccount`, "_blank");
          }}
          onSocialConnect={onSocialClick}
        />
      ) : (
        <Box display="flex" py={12} alignItems="center" justifyContent="center">
          <CircularProgress size={48} />
        </Box>
      )}
    </Dialog>
  );
};

export default Permissions;
