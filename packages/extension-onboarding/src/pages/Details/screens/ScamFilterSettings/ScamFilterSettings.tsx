import Switch from "@extension-onboarding/components/Switch";
import { useStyles } from "@extension-onboarding/pages/Details/screens/ScamFilterSettings/ScamFilterSettings.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import {
  Box,
  Divider,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import React, { FC, useEffect, useState } from "react";
declare const window: IWindowWithSdlDataWallet;

interface IScamFilterPreferences {
  isScamFilterActive: boolean;
  showMessageEveryTime: boolean;
}

const ScamFilterSettings: FC = () => {
  const classes = useStyles();
  const [scamFilterPreferences, setScamFilterPreferences] =
    useState<IScamFilterPreferences>();

  useEffect(() => {
    getScamFfilterSettings();
  }, []);
  useEffect(() => {
    console.log("ismessage", scamFilterPreferences?.showMessageEveryTime);
  }, [scamFilterPreferences]);

  const getScamFfilterSettings = () => {
    return window.sdlDataWallet.getScamFilterSettings().map((preferences) => {
      if (!preferences) {
        window.sdlDataWallet.setScamFilterSettings(true, true);
        return getScamFfilterSettings();
      } else {
        setScamFilterPreferences(preferences);
      }
    });
  };

  const handleApplyDefaultOptionChange = (optionStr: "true" | "false") => {
    const option = optionStr === "true";
    window.sdlDataWallet
      .setScamFilterSettings(
        scamFilterPreferences?.isScamFilterActive ?? false,
        option,
      )
      .andThen(() => {
        return getScamFfilterSettings();
      });
  };

  return (
    <Box>
      <Box>
        <Typography className={classes.title}>Scam Filter Settings</Typography>
        <Typography className={classes.description}>
          Update your scam filter preferences to optimize your experience.
        </Typography>
      </Box>
      <Box mt={4}>
        <Box display="flex" flexDirection="column">
          <Box mb={2} display="flex" alignItems="center">
            <Typography className={classes.sectionTitle}>
              Scam Filter
            </Typography>
            <Switch
              checked={scamFilterPreferences?.isScamFilterActive === true}
              value={scamFilterPreferences?.isScamFilterActive}
              onChange={(event) => {
                if (event.target.checked) {
                  setScamFilterPreferences({
                    isScamFilterActive: true,
                    showMessageEveryTime:
                      scamFilterPreferences?.showMessageEveryTime ?? false,
                  });
                  window.sdlDataWallet.setScamFilterSettings(
                    true,
                    scamFilterPreferences?.showMessageEveryTime ?? false,
                  );
                } else {
                  setScamFilterPreferences({
                    isScamFilterActive: false,
                    showMessageEveryTime:
                      scamFilterPreferences?.showMessageEveryTime ?? false,
                  });
                  window.sdlDataWallet.setScamFilterSettings(
                    false,
                    scamFilterPreferences?.showMessageEveryTime ?? false,
                  );
                }
              }}
            />
          </Box>
          <Box mb={2} border="1px solid #D9D9D9" p={4} borderRadius={8}>
            <Box display="flex" flexDirection="column">
              <RadioGroup
                value={scamFilterPreferences?.showMessageEveryTime ?? false}
                onChange={(e) =>
                  handleApplyDefaultOptionChange(
                    e.target.value as "true" | "false",
                  )
                }
              >
                <FormControlLabel
                  className={classes.label}
                  value={true}
                  control={<Radio />}
                  label="Give me a 'verified' message on each website every time."
                />
                <Box width="100%" py={2}>
                  <Divider />
                </Box>
                <FormControlLabel
                  className={classes.label}
                  value={false}
                  control={<Radio />}
                  label="Give me a 'verified' message for each website only once."
                />
              </RadioGroup>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ScamFilterSettings;
