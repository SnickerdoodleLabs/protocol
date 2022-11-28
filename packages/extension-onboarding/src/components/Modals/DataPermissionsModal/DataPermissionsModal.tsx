import Button from "@extension-onboarding/components/Button";
import { useStyles } from "@extension-onboarding/components/Modals/DataPermissionsModal/DataPermissionsModal.style";
import Switch from "@extension-onboarding/components/Switch";
import {
  PERMISSION_NAMES,
  PERMISSIONS,
} from "@extension-onboarding/constants/permissions";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import {
  Box,
  Dialog,
  Typography,
  IconButton,
  FormControlLabel,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { EWalletDataType } from "@snickerdoodlelabs/objects";
import React, { useEffect, FC, useState } from "react";

declare const window: IWindowWithSdlDataWallet;

const DataPermissionsModal: FC = () => {
  const { modalState, closeModal } = useLayoutContext();
  const { onPrimaryButtonClick } = modalState;

  const [permissionForm, setPermissionForm] = useState<EWalletDataType[]>([]);

  useEffect(() => {
    window.sdlDataWallet.getDefaultPermissions().map((permissions) => {
      setPermissionForm(permissions.filter((item) => !!PERMISSION_NAMES[item]));
    });
  }, []);

  const classes = useStyles();
  return (
    <Dialog
      PaperProps={{
        square: true,
      }}
      open={true}
      disablePortal
      maxWidth="sm"
      fullWidth
      className={classes.container}
    >
      <Box
        display="flex"
        mb={4}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography className={classes.title}>
          Manage Your Data Permissions
        </Typography>
        <IconButton
          disableFocusRipple
          disableRipple
          disableTouchRipple
          aria-label="close"
          onClick={closeModal}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <>
        <Box>
          <Typography className={classes.contentSubtitle}>
            Choose your data permissions to control what information you share.
          </Typography>
        </Box>
        <Box mt={4} display="flex">
          {PERMISSIONS.map((item, index) => {
            return (
              <Box display="flex" flexDirection="column" flex={1} key={index}>
                <Box mb={2}>
                  <Typography className={classes.sectionTitle}>
                    {item.title}
                  </Typography>
                </Box>
                {item.dataTypes.map((dataType, index) => {
                  return (
                    <Box key={index}>
                      <FormControlLabel
                        className={classes.switchLabel}
                        control={
                          <Switch
                            checked={permissionForm.includes(dataType)}
                            value={permissionForm.includes(dataType)}
                            onChange={(event) => {
                              if (event.target.checked) {
                                setPermissionForm([
                                  ...(permissionForm ?? []),
                                  dataType,
                                ]);
                              } else {
                                setPermissionForm(
                                  permissionForm?.filter(
                                    (_dataType) => _dataType != dataType,
                                  ),
                                );
                              }
                            }}
                          />
                        }
                        label={PERMISSION_NAMES[dataType]}
                      />
                    </Box>
                  );
                })}
              </Box>
            );
          })}
        </Box>
        <Box mt={4} display="flex">
          <Box marginLeft="auto">
            <Button
              buttonType="primary"
              onClick={() => {
                onPrimaryButtonClick(permissionForm);
                closeModal();
              }}
            >
              Save & Claim Reward
            </Button>
          </Box>
        </Box>
      </>
    </Dialog>
  );
};

export default DataPermissionsModal;
