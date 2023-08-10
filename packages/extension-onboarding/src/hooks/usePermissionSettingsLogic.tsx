import { EWalletDataType } from "@snickerdoodlelabs/objects";
import React, { useEffect, useMemo, useState } from "react";

import { PERMISSION_NAMES } from "@extension-onboarding/constants/permissions";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
const usePermissionSettingsLogic = (): {
  applyDefaults: boolean;
  handleApplyDefaultOptionChange: (optionStr: "true" | "false") => void;
  permissionForm: EWalletDataType[];
  addPermission: (dataType: EWalletDataType) => void;
  removePermission: (dataType: EWalletDataType) => void;
} => {
  const [applyDefaults, setApplyDefaults] = useState<boolean>(false);
  const [permissionForm, setPermissionForm] = useState<EWalletDataType[]>([]);
  const { sdlDataWallet } = useDataWalletContext();

  useEffect(() => {
    getApplyDefaultOption();
    getPermissions();
  }, []);

  const getApplyDefaultOption = () => {
    return sdlDataWallet
      .getApplyDefaultPermissionsOption()
      .map((option) => setApplyDefaults(option));
  };

  const getPermissions = () => {
    return sdlDataWallet.getDefaultPermissions().map((permissions) => {
      setPermissionForm(permissions.filter((item) => !!PERMISSION_NAMES[item]));
    });
  };

  const setPermissions = (dataTypes: EWalletDataType[]) => {
    return sdlDataWallet.setDefaultPermissions(dataTypes).andThen(() => {
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

    sdlDataWallet.setApplyDefaultPermissionsOption(option).andThen(() => {
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
