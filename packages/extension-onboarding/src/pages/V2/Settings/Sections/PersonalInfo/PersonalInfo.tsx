import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import YearSelector from "@extension-onboarding/components/v2/YearSelector";
import { countries } from "@extension-onboarding/constants/countries";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import { Box, IconButton, Menu, MenuItem, makeStyles } from "@material-ui/core";
import CreateIcon from "@material-ui/icons/Create";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import TodayIcon from "@material-ui/icons/Today";
import { CountryCode, Gender, UnixTimestamp } from "@snickerdoodlelabs/objects";
import {
  Card,
  CardTitle,
  SDButton,
  SDTypography,
} from "@snickerdoodlelabs/shared-components";
import { okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import React, { useCallback, useEffect, useRef } from "react";

const useStyles = makeStyles((theme) => ({
  iconButton: {
    padding: 0,
    "&:hover": {
      backgroundColor: "transparent",
    },
    margin: 0,
    "& svg": {
      width: 20,
      height: 20,
    },
  },
}));

interface Item {
  title: string;
  valueKey: keyof IDemographics;
  displayValue: (value) => string | number | null;
}

const items: Item[] = [
  {
    title: "Year of Birth",
    valueKey: "yearOfBirth",
    displayValue: (value: number | null) => value,
  },
  {
    title: "Country",
    valueKey: "countryCode",
    displayValue: (value: CountryCode | null) =>
      value ? countries.find((c) => c.code === value)?.name ?? null : null,
  },
  {
    title: "Gender",
    valueKey: "gender",
    displayValue: (value: Gender | null) =>
      genders.find((g) => g.value === value)?.name ?? null,
  },
];

interface IDemographics {
  countryCode: CountryCode | null;
  gender: Gender | null;
  yearOfBirth: number | null;
}

enum EMode {
  VIEW,
  EDIT,
}

const genders = [
  { name: "Female", value: "female" },
  { name: "Male", value: "male" },
  { name: "Non Binary", value: "nonbinary" },
  { name: "Not Specified", value: null },
];

const PersonalInfo = () => {
  const { sdlDataWallet } = useDataWalletContext();
  const classes = useStyles();
  const latesSavedDemographics = useRef<IDemographics>();
  const [demographics, setDemographics] = React.useState<IDemographics>();
  const [mode, setMode] = React.useState<EMode>(EMode.VIEW);
  const [saveRequired, setSaveRequired] = React.useState(false);
  const { setAlert } = useNotificationContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openedMenu, setOpenedMenu] = React.useState<
    keyof IDemographics | null
  >(null);
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    key: keyof IDemographics,
  ) => {
    setOpenedMenu(key);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getCommonProps = (item) => {
    return {
      iconButtonProps: {
        classes: { root: classes.iconButton },
        color: "primary" as const,
        onClick: (event) => handleClick(event, item.valueKey),
      },
      menuProps: {
        anchorOrigin: {
          vertical: "bottom" as const,
          horizontal: "right" as const,
        },
        transformOrigin: {
          vertical: "top" as const,
          horizontal: "right" as const,
        },
        id: `${item.valueKey}-menu`,
        anchorEl,
        keepMounted: true,
        open: Boolean(anchorEl) && openedMenu === item.valueKey,
        onClose: handleClose,
      },
    };
  };

  const getDemographics = () => {
    ResultUtils.combine([
      sdlDataWallet.getLocation(),
      sdlDataWallet.getBirthday(),
      sdlDataWallet.getGender(),
    ])
      .map(([countryCode, timeStamp, gender]) => {
        const yearOfBirth = timeStamp
          ? new Date(timeStamp * 1000).getFullYear()
          : null;
        setDemographics({ countryCode, yearOfBirth, gender });
      })
      .mapErr((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getDemographics();
  }, []);

  useEffect(() => {
    if (demographics) {
      if (!latesSavedDemographics.current) {
        latesSavedDemographics.current = demographics;
      } else {
        if (
          JSON.stringify(latesSavedDemographics.current) !==
          JSON.stringify(demographics)
        ) {
          setSaveRequired(true);
        } else {
          setSaveRequired(false);
        }
      }
    }
  }, [JSON.stringify(demographics)]);

  const getValueByKey = useCallback(
    (key: keyof IDemographics) => {
      if (!demographics) {
        return null;
      }
      return demographics[key];
    },
    [JSON.stringify(demographics)],
  );

  const setValuesByKey = useCallback(
    (key: keyof IDemographics, value) => {
      if (!demographics) {
        return;
      }
      setDemographics({ ...demographics, [key]: value });
    },
    [JSON.stringify(demographics)],
  );
  const onCancelClicked = useCallback(() => {
    if (saveRequired) {
      setDemographics(latesSavedDemographics.current);
    }
    setMode(EMode.VIEW);
  }, [saveRequired]);

  const handleSaveClick = useCallback(() => {
    if (!demographics) {
      return;
    }
    if (!latesSavedDemographics.current) {
      return;
    }

    ResultUtils.combine([
      demographics.yearOfBirth
        ? sdlDataWallet.setBirthday(
            UnixTimestamp(
              new Date(
                Date.UTC(demographics.yearOfBirth, 0, 1, 0, 0, 0, 0),
              ).getTime() / 1000,
            ),
          )
        : okAsync(undefined),
      sdlDataWallet.setGender(Gender(demographics.gender as string)),
      sdlDataWallet.setLocation(
        CountryCode(demographics.countryCode as string),
      ),
    ])
      .map(() => {
        latesSavedDemographics.current = demographics;
        setMode(EMode.VIEW);
        setAlert({
          severity: EAlertSeverity.SUCCESS,
          message: "Personal info updated successfully.",
        });
      })
      .mapErr((err) => {
        setDemographics(latesSavedDemographics.current);
        setMode(EMode.VIEW);
        setAlert({
          severity: EAlertSeverity.ERROR,
          message: "Failed to update demographics.",
        });
      });
  }, [demographics]);

  const getEditComponentByItem = useCallback(
    (item: Item) => {
      if (!demographics || mode === EMode.VIEW) {
        return null;
      }

      const { iconButtonProps, menuProps } = getCommonProps(item);

      switch (item.valueKey) {
        case "yearOfBirth":
          return (
            <>
              <IconButton {...iconButtonProps}>
                <TodayIcon />
              </IconButton>
              <Menu {...menuProps}>
                <YearSelector
                  onSelect={(year) => {
                    setValuesByKey(item.valueKey, year);
                    handleClose();
                  }}
                />
              </Menu>
            </>
          );

        case "countryCode":
          return (
            <>
              <IconButton {...iconButtonProps}>
                <KeyboardArrowDownIcon />
              </IconButton>
              <Menu {...menuProps}>
                {countries.map((country) => (
                  <MenuItem
                    onClick={() => {
                      setValuesByKey(item.valueKey, country.code);
                      handleClose();
                    }}
                  >
                    {country.name}
                  </MenuItem>
                ))}
              </Menu>
            </>
          );

        case "gender":
          return (
            <>
              <IconButton {...iconButtonProps}>
                <KeyboardArrowDownIcon />
              </IconButton>
              <Menu {...menuProps}>
                {genders.map((gender) => (
                  <MenuItem
                    onClick={() => {
                      setValuesByKey(item.valueKey, gender.value);
                      handleClose();
                    }}
                  >
                    {gender.name}
                  </MenuItem>
                ))}
              </Menu>
            </>
          );

        default:
          return null;
      }
    },
    [mode, JSON.stringify(demographics), openedMenu, anchorEl],
  );

  return (
    <Card>
      <Box display="flex" justifyContent="space-between">
        <CardTitle
          title={(titleRenderer) => (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              {titleRenderer("Personal Info")}
              {mode === EMode.VIEW ? (
                <SDButton
                  startIcon={<CreateIcon />}
                  onClick={() => {
                    setMode(EMode.EDIT);
                  }}
                  variant="text"
                >
                  Edit
                </SDButton>
              ) : (
                <>
                  <Box display="flex">
                    <SDButton onClick={onCancelClicked} variant="text">
                      Cancel
                    </SDButton>
                    {saveRequired && (
                      <SDButton onClick={handleSaveClick} variant="text">
                        Save
                      </SDButton>
                    )}
                  </Box>
                </>
              )}
            </Box>
          )}
          subtitle="Enter basic demographic information. No one will ever see the exact values you enter, only high-level aggregate insights."
        />
      </Box>
      {items.map((item, index) => (
        <Box
          key={index}
          mt={3}
          p={3}
          borderRadius={14}
          borderColor={"borderColor"}
          border="1px solid"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <SDTypography
            variant="bodyLg"
            fontWeight="medium"
            color="textHeading"
          >
            {item.title}
          </SDTypography>
          <Box display="flex" justifyContent="center">
            <SDTypography
              variant="bodyLg"
              fontWeight="regular"
              color="textSubtitle"
            >
              {item.displayValue(getValueByKey(item.valueKey))}
            </SDTypography>

            {mode === EMode.EDIT && (
              <>
                <Box ml={1.5} />
                {getEditComponentByItem(item)}
              </>
            )}
          </Box>
        </Box>
      ))}
    </Card>
  );
};

export default PersonalInfo;
