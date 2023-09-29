import {
  Box,
  CircularProgress,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import React, { FC, useEffect, useState } from "react";

import Switch from "@extension-onboarding/components/Switch";
import Typography from "@extension-onboarding/components/Typography";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useStyles } from "@extension-onboarding/pages/Details/screens/ScamFilterSettings/ScamFilterSettings.style";
interface IScamFilterPreferences {
  isScamFilterActive: boolean;
  showMessageEveryTime: boolean;
}

const ScamFilterSettings: FC = () => {
  const classes = useStyles();
  const [scamFilterPreferences, setScamFilterPreferences] =
    useState<IScamFilterPreferences>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { sdlDataWallet } = useDataWalletContext();

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
    return sdlDataWallet.getScamFilterSettings().map((preferences) => {
      if (!preferences) {
        sdlDataWallet.setScamFilterSettings(true, true);
        return getScamFfilterSettings();
      } else {
        setScamFilterPreferences(preferences);
      }
    });
  };

  const handleApplyDefaultOptionChange = (optionStr: "true" | "false") => {
    const option = optionStr === "true";
    sdlDataWallet
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
        <Typography variant="pageTitle">Scam Filter Settings</Typography>
        <Box mt={1}>
          <Typography variant="pageDescription">
            Update your scam filter preferences to optimize your experience.
          </Typography>
        </Box>
      </Box>
      {!isLoading ? (
        <Box mt={4}>
          <Box display="flex" flexDirection="column">
            <Box display="flex" alignItems="center">
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
                    sdlDataWallet.setScamFilterSettings(
                      true,
                      scamFilterPreferences?.showMessageEveryTime ?? false,
                    );
                  } else {
                    setScamFilterPreferences({
                      isScamFilterActive: false,
                      showMessageEveryTime:
                        scamFilterPreferences?.showMessageEveryTime ?? false,
                    });
                    sdlDataWallet.setScamFilterSettings(
                      false,
                      scamFilterPreferences?.showMessageEveryTime ?? false,
                    );
                  }
                }}
              />
            </Box>
            <Box mb={2}>
              <Typography className={classes.infoText}>
                {scamFilterPreferences?.isScamFilterActive
                  ? `Scam filter is now active. Websites you visit will automatically be checked against our white list to filter out scams. Look for the Snickerdoodle "verified" message in the top right of your browser window.`
                  : `Scam filter is inactive. Websites you visit will not be verified against our white list.`}
              </Typography>
            </Box>
            {scamFilterPreferences?.isScamFilterActive === true && (
              <Box
                bgcolor="#fff"
                mt={0.5}
                mb={2}
                border="1px solid #D9D9D9"
                p={4}
                borderRadius={8}
              >
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
                      label={`Show me a "verified" message for each website, every time I visit.`}
                    />
                    <Box width="100%" py={2}>
                      <Divider />
                    </Box>
                    <FormControlLabel
                      className={classes.label}
                      value={false}
                      control={<Radio />}
                      label={`Show me a "verified" message for each website, only the first time I visit.`}
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
