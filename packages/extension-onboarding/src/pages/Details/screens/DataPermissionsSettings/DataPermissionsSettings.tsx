import Switch from "@extension-onboarding/components/Switch";
import {
  PERMISSIONS,
  PERMISSION_DESCRIPTIONS,
  PERMISSION_NAMES,
} from "@extension-onboarding/constants/permissions";
import { useStyles } from "@extension-onboarding/pages/Details/screens/DataPermissionsSettings/DataPermissionsSettings.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import { EWalletDataType } from "@snickerdoodlelabs/objects";
import React, { FC, useEffect, useMemo, useState } from "react";
declare const window: IWindowWithSdlDataWallet;

const DataPermissionsSettings: FC = () => {
  const classes = useStyles();
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

  const handleApplyDefaultOptionChange = (optionStr: "true" | "false") => {
    const option = optionStr === "true";

    window.sdlDataWallet
      .setApplyDefaultPermissionsOption(option)
      .andThen(() => {
        return getApplyDefaultOption();
      });
  };

  return (
    <Box>
      <Box>
        <Typography className={classes.title}>Data Permissions</Typography>
        <Typography className={classes.description}>
          You can set permission for every data that you have in your data
          wallet individually.
        </Typography>
        <Box mt={5}>
          <RadioGroup
            value={applyDefaults}
            onChange={(e) =>
              handleApplyDefaultOptionChange(e.target.value as "true" | "false")
            }
          >
            <FormControlLabel
              className={classes.label}
              value={true}
              control={<Radio />}
              label="Apply my settings for every rewards"
            />
            <FormControlLabel
              className={classes.label}
              value={false}
              control={<Radio />}
              label="Ask me about my settings for everytime I accept the reward"
            />
          </RadioGroup>
        </Box>
      </Box>
      <Box mt={4}>
        {PERMISSIONS.map((item, sectionIndex) => {
          return (
            <Box display="flex" flexDirection="column" key={sectionIndex}>
              <Box mb={2}>
                <Typography className={classes.sectionTitle}>
                  {item.title}
                </Typography>
              </Box>
              <Box mb={7} border="1px solid #D9D9D9" p={4} borderRadius={8}>
                <Grid container>
                  {item.dataTypes.map((dataType, index) => {
                    return (
                      <Grid
                        key={index}
                        item
                        xs={PERMISSION_DESCRIPTIONS[dataType] ? 12 : 6}
                      >
                        <Box
                          mb={1}
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Typography className={classes.switchLabel}>
                            {PERMISSION_NAMES[dataType]}
                          </Typography>
                          <Box>
                            <Switch
                              checked={permissionForm.includes(dataType)}
                              value={permissionForm.includes(dataType)}
                              onChange={(event) => {
                                if (event.target.checked) {
                                  setPermissions([
                                    ...(permissionForm ?? []),
                                    dataType,
                                  ]);
                                } else {
                                  setPermissions(
                                    permissionForm?.filter(
                                      (_dataType) => _dataType != dataType,
                                    ),
                                  );
                                }
                              }}
                            />
                          </Box>
                        </Box>
                        {PERMISSION_DESCRIPTIONS[dataType] && (
                          <Box mb={1}>
                            <Typography
                              className={classes.permissionDescription}
                            >
                              {PERMISSION_DESCRIPTIONS[dataType]}
                            </Typography>
                          </Box>
                        )}
                        {item.dataTypes.length != index + 1 && <Box mt={3} />}
                        {item.dataTypes.length != index + 1 && (
                          <Box mb={2}>
                            <Divider />
                          </Box>
                        )}
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default DataPermissionsSettings;
