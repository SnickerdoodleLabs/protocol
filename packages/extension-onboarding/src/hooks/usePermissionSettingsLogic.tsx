import { PERMISSION_NAMES } from "@extension-onboarding/constants/permissions";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { EWalletDataType } from "@snickerdoodlelabs/objects";
import React, { useEffect, useMemo, useState } from "react";
declare const window: IWindowWithSdlDataWallet;

const usePermissionSettingsLogic = (): {
  applyDefaults: boolean;
  handleApplyDefaultOptionChange: (optionStr: "true" | "false") => void;
  permissionForm: EWalletDataType[];
  addPermission: (dataType: EWalletDataType) => void;
  removePermission: (dataType: EWalletDataType) => void;
} => {
  const [applyDefaults, setApplyDefaults] = useState<boolean>(false);
  const [permissionForm, setPermissionForm] = useState<EWalletDataType[]>([]);

  useEffect(() => {
    getApplyDefaultOption();
    getPermissions();
  }, []);

  const getApplyDefaultOption = () => {
    return window.sdlDataWallet
      .getApplyDefaultPermissionsOption()
      .map((option) => setApplyDefaults(option));
  };

  const getPermissions = () => {
    return window.sdlDataWallet.getDefaultPermissions().map((permissions) => {
      setPermissionForm(permissions.filter((item) => !!PERMISSION_NAMES[item]));
    });
  };

  const setPermissions = (dataTypes: EWalletDataType[]) => {
    return window.sdlDataWallet.setDefaultPermissions(dataTypes).andThen(() => {
      return getPermissions();
    });
  };

  const addPermission = (dataType: EWalletDataType) => {
    setPermissions([...(permissionForm ?? []), dataType]);
  };

  const removePermission = (dataType: EWalletDataType) => {
    setPermissions(
      permissionForm?.filter((_dataType) => _dataType != dataType),
    );
  };

  const handleApplyDefaultOptionChange = (optionStr: "true" | "false") => {
    const option = optionStr === "true";

    window.sdlDataWallet
      .setApplyDefaultPermissionsOption(option)
      .andThen(() => {
        return getApplyDefaultOption();
      });
  };

  return {
    applyDefaults,
    addPermission,
    removePermission,
    handleApplyDefaultOptionChange,
    permissionForm,
  };
};

export default usePermissionSettingsLogic;
