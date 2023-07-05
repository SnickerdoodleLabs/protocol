import { UI_SUPPORTED_PERMISSIONS } from "@snickerdoodlelabs/shared-components";
import { EAppModes, useAppContext } from "@extension-onboarding/context/App";
import { PII } from "@extension-onboarding/services/interfaces/objects";
import {
  DiscordProfile,
  ENotificationTypes,
  EWalletDataType,
  TwitterProfile,
} from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";
import React, {
  FC,
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { ResultUtils } from "neverthrow-result-utils";

declare const window: IWindowWithSdlDataWallet;
interface IPermissionContext {
  isSafe: (dataType: EWalletDataType) => boolean;
  generateAllPermissions: () => ResultAsync<EWalletDataType[], unknown>;
  updateProfileValues: () => void;
  updateSocialProfileValues: () => void;
}

const PermissionContext = createContext<IPermissionContext>(
  {} as IPermissionContext,
);

export const PermissionManagerContextProvider: FC = ({ children }) => {
  const { dataWalletGateway, appMode, linkedAccounts } = useAppContext();
  const [socialProfileValues, setSocialProfileValues] = useState<{
    discordProfiles: DiscordProfile[];
    twitterProfiles: TwitterProfile[];
  }>();
  const [profileValues, setProfileValues] = useState<PII>();
  const isInitialized = useRef<boolean>();

  useEffect(() => {
    if (appMode === EAppModes.AUTH_USER) {
      updateProfileValues();
      updateSocialProfileValues();
      isInitialized.current = true;
      window?.sdlDataWallet.on(
        ENotificationTypes.SOCIAL_PROFILE_LINKED,
        updateSocialProfileValues,
      );
      window?.sdlDataWallet.on(
        ENotificationTypes.PROFILE_FIELD_CHANGED,
        updateProfileValues,
      );
    }
    return () => {
      window?.sdlDataWallet.off(
        ENotificationTypes.SOCIAL_PROFILE_LINKED,
        updateSocialProfileValues,
      );
      window?.sdlDataWallet.off(
        ENotificationTypes.PROFILE_FIELD_CHANGED,
        updateProfileValues,
      );
    };
  }, [appMode]);

  const updateProfileValues = (): ResultAsync<PII, unknown> => {
    return dataWalletGateway.profileService.getProfile().map((values) => {
      setProfileValues(values);
      return values;
    });
  };

  const updateSocialProfileValues = () => {
    return ResultUtils.combine([
      window?.sdlDataWallet.discord.getUserProfiles(),
      window?.sdlDataWallet.twitter.getUserProfiles(),
    ]).map(([discordProfiles, twitterProfiles]) => {
      const values = { discordProfiles, twitterProfiles };
      setSocialProfileValues(values);
      return values;
    });
  };

  const generateAllPermissions = useCallback((): ResultAsync<
    EWalletDataType[],
    unknown
  > => {
    let permissions = UI_SUPPORTED_PERMISSIONS;
    return ResultUtils.combine([
      profileValues ? okAsync(profileValues) : updateProfileValues(),
      socialProfileValues
        ? okAsync(socialProfileValues)
        : updateSocialProfileValues(),
    ]).map(([pii, socialValues]) => {
      if (!pii.date_of_birth) {
        permissions = permissions.filter((item) => item != EWalletDataType.Age);
      }
      if (!pii.gender) {
        permissions = permissions.filter(
          (item) => item != EWalletDataType.Gender,
        );
      }
      if (!pii.country_code) {
        permissions = permissions.filter(
          (item) => item != EWalletDataType.Location,
        );
      }
      if (!socialValues.discordProfiles.length) {
        permissions = permissions.filter(
          (item) => item != EWalletDataType.Discord,
        );
      }
      if (!socialValues.twitterProfiles.length) {
        permissions = permissions.filter(
          (item) => item != EWalletDataType.Twitter,
        );
      }
      console.log({ permissions });
      return permissions;
    });
  }, [[JSON.stringify(profileValues), JSON.stringify(socialProfileValues)]]);

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

  return (
    <PermissionContext.Provider
      value={{
        isSafe,
        generateAllPermissions,
        updateProfileValues,
        updateSocialProfileValues,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissionContext = () => useContext(PermissionContext);
