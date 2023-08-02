import { DiscordProfile, EWalletDataType } from "@snickerdoodlelabs/objects";
import { UI_SUPPORTED_PERMISSIONS } from "@snickerdoodlelabs/shared-components";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import React, {
  FC,
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Subscription } from "rxjs";

import { EAppModes, useAppContext } from "@extension-onboarding/context/App";
import { PII } from "@extension-onboarding/services/interfaces/objects";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";

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
    // twitterProfiles: TwitterProfile[];
  }>();
  const [profileValues, setProfileValues] = useState<PII>();
  const isInitialized = useRef<boolean>();

  let socialProviderLinkedSubscription: Subscription | null = null;
  let birthdaySubscription: Subscription | null = null;
  let genderSubscription: Subscription | null = null;
  let locationSubscription: Subscription | null = null;

  useEffect(() => {
    console.log("tracking use effect in permission context!!!");

    if (appMode === EAppModes.AUTH_USER) {
      updateProfileValues();
      updateSocialProfileValues();
      isInitialized.current = true;

      socialProviderLinkedSubscription =
        window?.sdlDataWallet?.events.onSocialProfileLinked.subscribe(
          updateSocialProfileValues,
        );

      birthdaySubscription =
        window?.sdlDataWallet?.events.onBirthdayUpdated.subscribe(
          updateProfileValues,
        );
      genderSubscription =
        window?.sdlDataWallet?.events.onGenderUpdated.subscribe(
          updateProfileValues,
        );
      locationSubscription =
        window?.sdlDataWallet?.events.onLocationUpdated.subscribe(
          updateProfileValues,
        );
    }
    return () => {
      socialProviderLinkedSubscription?.unsubscribe();
      birthdaySubscription?.unsubscribe();
      genderSubscription?.unsubscribe();
      locationSubscription?.unsubscribe();
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
      // window?.sdlDataWallet.twitter.getUserProfiles(),
    ]).map(([discordProfiles]) => {
      const values = { discordProfiles };
      // twitterProfiles };
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
      // if (!socialValues.twitterProfiles.length) {
      //   permissions = permissions.filter(
      //     (item) => item != EWalletDataType.Twitter,
      //   );
      // }
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
        // case EWalletDataType.Twitter:
        //   return !!socialProfileValues?.twitterProfiles.length;
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
