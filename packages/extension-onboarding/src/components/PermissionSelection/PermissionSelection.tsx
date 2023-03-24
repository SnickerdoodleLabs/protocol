import Switch from "@extension-onboarding/components/Switch";
import {
  PERMISSIONS,
  PERMISSION_DESCRIPTIONS,
  PERMISSION_NAMES,
} from "@extension-onboarding/constants/permissions";
import usePermissionSettingsLogic from "@extension-onboarding/hooks/usePermissionSettingsLogic";
import { useStyles } from "@extension-onboarding/components/PermissionSelection/PermissionSelection.style";
import {
  Box,
  Divider,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import React, { FC } from "react";

interface IPermissionSelection {
  showDefaultsSettings?: boolean;
}

const PermissionSelection: FC<IPermissionSelection> = ({
  showDefaultsSettings = true,
}) => {
  const {
    permissionForm,
    handleApplyDefaultOptionChange,
    applyDefaults,
    addPermission,
    removePermission,
  } = usePermissionSettingsLogic();
  const classes = useStyles();

  return (
    <Box>
      {showDefaultsSettings && (
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
      )}
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
                                  addPermission(dataType);
                                } else {
                                  removePermission(dataType);
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

export default PermissionSelection;
