import { UI_SUPPORTED_PERMISSIONS } from "@snickerdoodlelabs/shared-components";
import { EAppModes, useAppContext } from "@extension-onboarding/context/App";
import { PII } from "@extension-onboarding/services/interfaces/objects";
import { EWalletDataType } from "@snickerdoodlelabs/objects";
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

interface IPermissionContext {
  isSafe: (dataType: EWalletDataType) => boolean;
  generateAllPermissions: () => ResultAsync<EWalletDataType[], unknown>;
  updateProfileValues: () => void;
}

const PermissionContext = createContext<IPermissionContext>(
  {} as IPermissionContext,
);

export const PermissionManagerContextProvider: FC = ({ children }) => {
  const { dataWalletGateway, appMode, linkedAccounts } = useAppContext();
  const [profileValues, setProfileValues] = useState<PII>();
  const isInitialized = useRef<boolean>();

  useEffect(() => {
    if (
      (appMode === EAppModes.AUTHENTICATED_FLOW || linkedAccounts.length > 0) &&
      !isInitialized.current
    ) {
      updateProfileValues();
      isInitialized.current = true;
    }
  }, [appMode, linkedAccounts.length]);

  const updateProfileValues = (): ResultAsync<PII, unknown> => {
    return dataWalletGateway.profileService.getProfile().map((values) => {
      setProfileValues(values);
      return values;
    });
  };

  const generateAllPermissions = (): ResultAsync<
    EWalletDataType[],
    unknown
  > => {
    let permissions = UI_SUPPORTED_PERMISSIONS;
    return (profileValues ? okAsync(profileValues) : updateProfileValues()).map(
      (pii) => {
        if (!pii.date_of_birth) {
          permissions = permissions.filter(
            (item) => item != EWalletDataType.Age,
          );
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
        return permissions;
      },
    );
  };

  const isSafe = useCallback(
    (dataType: EWalletDataType) => {
      switch (dataType) {
        case EWalletDataType.Age:
          return !!profileValues?.date_of_birth;
        case EWalletDataType.Location:
          return !!profileValues?.country_code;
        case EWalletDataType.Gender:
          return !!profileValues?.gender;
        default:
          return true;
      }
    },
    [JSON.stringify(profileValues)],
  );

  return (
    <PermissionContext.Provider
      value={{
        isSafe,
        generateAllPermissions,
        updateProfileValues,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissionContext = () => useContext(PermissionContext);
