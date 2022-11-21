import * as defaultLoading from "@extension-onboarding/assets/lotties/loading.json";
import Switch from "@extension-onboarding/components/Switch";
import { LOTTIE_DEFAULT_OPTIONS } from "@extension-onboarding/constants/lottieDefaults";
import { useStyles } from "@extension-onboarding/pages/Details/screens/ScamFilterSettings/ScamFilterSettings.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import {
  Box,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import React, { FC, useEffect, useState } from "react";
import Lottie from "react-lottie";
declare const window: IWindowWithSdlDataWallet;

interface IScamFilterPreferences {
  isScamFilterActive: boolean;
  showMessageEveryTime: boolean;
}

const ScamFilterSettings: FC = () => {
  const classes = useStyles();
  const [scamFilterPreferences, setScamFilterPreferences] =
    useState<IScamFilterPreferences>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getScamFfilterSettings();
  }, []);

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [JSON.stringify(scamFilterPreferences), isLoading]);

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
      {!isLoading ? (
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
            {scamFilterPreferences?.isScamFilterActive === true && (
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
                      className={
                        scamFilterPreferences?.isScamFilterActive
                          ? classes.label
                          : classes.labelDeactive
                      }
                      disabled={
                        !scamFilterPreferences?.isScamFilterActive ?? false
                      }
                      value={true}
                      control={<Radio />}
                      label={`Show “Verified” modal for each site every time on every visit`}
                    />
                    <Box width="100%" py={2}>
                      <Divider />
                    </Box>
                    <FormControlLabel
                      className={
                        scamFilterPreferences?.isScamFilterActive
                          ? classes.label
                          : classes.labelDeactive
                      }
                      disabled={
                        !scamFilterPreferences?.isScamFilterActive ?? false
                      }
                      value={false}
                      control={<Radio />}
                      label={`Show “Verified” modal for each site only once`}
                    />
                  </RadioGroup>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      ) : (
        <Box mt={10} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default ScamFilterSettings;
