import DateFnsUtils from "@date-io/date-fns";
import {
  Box,
  Collapse,
  Button as MUIButton,
  MenuItem,
  Tooltip as MUITooltip,
  withStyles,
  Divider,
  Typography,
} from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { useStyles } from "@shared-components/components/PermissionBar/PermissionBar.style";
import {
  COUNTRIES,
  PERMISSIONS_WITH_ICONS,
  UI_SUPPORTED_PERMISSIONS,
} from "@shared-components/constants";
import { useDatePickerPopoverStyles } from "@shared-components/styles/datePickerPopover";
import {
  CountryCode,
  EWalletDataType,
  Gender,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Select } from "formik-material-ui";
import { ResultAsync } from "neverthrow";
import React, { FC, useMemo, useState } from "react";
import * as yup from "yup";

interface IPermissionBarProps {
  setBirthday(birthday: UnixTimestamp): ResultAsync<void, unknown>;
  setLocation(location: CountryCode): ResultAsync<void, unknown>;
  setGender(gender: Gender): ResultAsync<void, unknown>;
  permissions: EWalletDataType[];
  onClick: (permission: EWalletDataType) => void;
  handleSelectAllClick: () => void;
  isSafe: (dataType: EWalletDataType) => boolean;
  updateProfileValues: () => void;
}

const Tooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#F18935",
    color: "white",
    maxWidth: 210,
    padding: 8,
    fontSize: 12,
    fontFamily: "Roboto",
    fontWeight: 400,
    lineHeight: "16px",
    borderRadius: 4,
  },
  arrow: {
    color: "#F18935",
  },
}))(MUITooltip);

const CancelButton = withStyles({
  root: {
    paddingLeft: 8,
    paddingRight: 8,
    boxShadow: "0px 2px 0px rgba(0, 0, 0, 0.043)",
    color: "#262626",
    border: "1px solid",
    borderColor: "#D9D9D9",
    fontStyle: "normal",
    fontFamily: "Public Sans",
    borderRadius: 4,
    fontWeight: 400,
    height: 22,
    fontSize: "12px",
    lineHeight: "20px",
    textTransform: "none",
    backgroundColor: "#FFF",
    "&:hover": {
      backgroundColor: "#FFF",
    },
  },
})(MUIButton);

const SaveButton = withStyles({
  root: {
    paddingLeft: 8,
    paddingRight: 8,
    boxShadow: "0px 2px 0px rgba(0, 0, 0, 0.043)",
    color: "#FFFFFF",
    border: "1px solid",
    borderColor: "#B9B6D3",
    fontStyle: "normal",
    fontFamily: "Public Sans",
    borderRadius: 4,
    fontWeight: 400,
    height: 22,
    fontSize: "12px",
    lineHeight: "20px",
    textTransform: "none",
    backgroundColor: "#8079B4",
    "&:hover": {
      backgroundColor: "#8079B4",
    },
  },
})(MUIButton);

export const PermissionBar: FC<IPermissionBarProps> = ({
  isSafe,
  updateProfileValues,
  setBirthday,
  setGender,
  setLocation,

  permissions,
  onClick,
  handleSelectAllClick,
}) => {
  const classes = useStyles();
  const [expandeds, setExpandeds] = useState<EWalletDataType[]>([]);

  const [dobFormValues, setDobFormValues] = useState({ date_of_birth: null });
  const [countryFormValues, setCountryFormValues] = useState({
    country_code: null,
  });

  const generateSuccessMessage = (dataType: EWalletDataType) => {
    return `Your "${
      PERMISSIONS_WITH_ICONS[dataType]!.name
    }" data has successfully saved`;
  };

  const popoverClasses = useDatePickerPopoverStyles();

  const [genderFormValues, setGenderFormValues] = useState({
    gender: null,
  });

  const dobScheme = yup.object().shape({
    date_of_birth: yup
      .date()
      .max(new Date(), "Please enter valid Date!")
      .required("Date of Birth is required")
      .typeError("Please enter valid Date!")
      .nullable(),
  });

  const onDOBFormSubmit = async (values: { date_of_birth: Date | null }) => {
    if (values.date_of_birth === null) {
      //   onCloseOrFail();
      return;
    } else {
      setBirthday(
        (+new Date(values.date_of_birth) / 1000) as UnixTimestamp,
      ).map(() => {
        setExpandeds((expandeds) =>
          expandeds.filter((item) => item != EWalletDataType.Age),
        );
        onClick(EWalletDataType.Age);
        updateProfileValues();
      });
    }
  };
  const onCountryFormSubmit = async (values: {
    country_code: CountryCode | null;
  }) => {
    if (values.country_code === null) {
      //   onCloseOrFail();
      return;
    } else {
      setLocation(values.country_code).map(() => {
        setExpandeds((expandeds) =>
          expandeds.filter((item) => item != EWalletDataType.Location),
        );
        onClick(EWalletDataType.Location);
        updateProfileValues();
      });
    }
  };
  const onGenderFormSubmit = async (values: { gender: Gender | null }) => {
    if (values.gender === null) {
      return;
    } else {
      setGender(values.gender).map(() => {
        setExpandeds((expandeds) =>
          expandeds.filter((item) => item != EWalletDataType.Gender),
        );
        onClick(EWalletDataType.Gender);
        updateProfileValues();
      });
    }
  };

  const renderForm = (dataType: EWalletDataType) => {
    switch (dataType) {
      case EWalletDataType.Age:
        return (
          <Formik
            initialValues={dobFormValues}
            onSubmit={onDOBFormSubmit}
            enableReinitialize
            validationSchema={dobScheme}
          >
            {({ handleSubmit, values, setFieldValue }) => {
              return (
                <Form noValidate onSubmit={handleSubmit} id="dob-form">
                  <Box my={2.5}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        PopoverProps={{
                          disablePortal: true,
                          classes: popoverClasses,
                        }}
                        className={classes.selectInput}
                        required
                        clearable
                        InputProps={{ autoComplete: "off" }}
                        autoOk
                        variant="inline"
                        placeholder="Select"
                        format="MM/dd/yyyy"
                        id="date-picker-inline"
                        invalidDateMessage=""
                        maxDateMessage=""
                        minDateMessage=""
                        onError={(e) => {}}
                        value={values.date_of_birth}
                        onChange={(date, value) => {
                          setFieldValue(
                            "date_of_birth",
                            date?.toString() === "Invalid Date" ? date : value,
                            true,
                          );
                        }}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                      />
                      <ErrorMessage
                        children={(errorMessage: string) => (
                          <Typography className={classes.errorMessage}>
                            {errorMessage}
                          </Typography>
                        )}
                        name="date_of_birth"
                      />
                    </MuiPickersUtilsProvider>
                  </Box>
                  <Box display="flex" justifyContent="flex-end">
                    <Box mr={0.5}>
                      <CancelButton
                        onClick={() => {
                          setExpandeds((expandeds) =>
                            expandeds.filter(
                              (item) => item != EWalletDataType.Age,
                            ),
                          );
                        }}
                      >
                        Cancel
                      </CancelButton>
                    </Box>
                    <SaveButton
                      onClick={() => {
                        handleSubmit();
                      }}
                    >
                      Save
                    </SaveButton>
                  </Box>
                </Form>
              );
            }}
          </Formik>
        );
      case EWalletDataType.Gender:
        return (
          <Formik
            initialValues={genderFormValues}
            onSubmit={onGenderFormSubmit}
            enableReinitialize
          >
            {({ handleSubmit, values, setFieldValue }) => {
              return (
                <Form noValidate onSubmit={handleSubmit} id="gender-form">
                  <Box my={2.5}>
                    <Field
                      className={classes.selectInput}
                      component={(props) => (
                        <Select
                          {...props}
                          MenuProps={{ disablePortal: true }}
                          displayEmpty
                          renderValue={
                            values.gender
                              ? undefined
                              : () => (
                                  <Typography className={classes.placeHolder}>
                                    Select your Gender
                                  </Typography>
                                )
                          }
                        />
                      )}
                      variant="outlined"
                      fullWidth
                      name="gender"
                      value={values.gender}
                    >
                      <MenuItem className={classes.menuItem}>Female</MenuItem>

                      <MenuItem className={classes.menuItem} value="male">
                        Male
                      </MenuItem>

                      <MenuItem className={classes.menuItem} value="nonbinary">
                        Non-Binary
                      </MenuItem>
                    </Field>
                    <ErrorMessage
                      children={(errorMessage: string) => (
                        <Typography className={classes.errorMessage}>
                          {errorMessage}
                        </Typography>
                      )}
                      name="gender"
                    />
                  </Box>
                  <Box display="flex" justifyContent="flex-end">
                    <Box mr={0.5}>
                      <CancelButton
                        onClick={() => {
                          setExpandeds((expandeds) =>
                            expandeds.filter(
                              (item) => item != EWalletDataType.Gender,
                            ),
                          );
                        }}
                      >
                        Cancel
                      </CancelButton>
                    </Box>
                    <SaveButton
                      onClick={() => {
                        handleSubmit();
                      }}
                    >
                      Save
                    </SaveButton>
                  </Box>
                </Form>
              );
            }}
          </Formik>
        );
      case EWalletDataType.Location:
        return (
          <Formik
            initialValues={countryFormValues}
            onSubmit={onCountryFormSubmit}
            enableReinitialize
          >
            {({ handleSubmit, values, setFieldValue }) => {
              return (
                <Form noValidate onSubmit={handleSubmit} id="country-form">
                  <Box my={2.5}>
                    <Field
                      size="small"
                      className={classes.selectInput}
                      component={(props) => (
                        <Select
                          {...props}
                          MenuProps={{
                            disablePortal: true,
                            style: { maxHeight: 300 },
                          }}
                          displayEmpty
                          renderValue={
                            values.country_code
                              ? undefined
                              : () => (
                                  <Typography className={classes.placeHolder}>
                                    Select your Country
                                  </Typography>
                                )
                          }
                        />
                      )}
                      variant="outlined"
                      fullWidth
                      name="country_code"
                      value={values.country_code}
                    >
                      <MenuItem
                        className={classes.menuItem}
                        selected
                        value="US"
                      >
                        United States
                      </MenuItem>
                      {COUNTRIES.map((country) => (
                        <MenuItem
                          className={classes.menuItem}
                          key={country.code}
                          value={country.code}
                        >
                          {country.name}
                        </MenuItem>
                      ))}
                    </Field>
                  </Box>
                  <Box display="flex" justifyContent="flex-end">
                    <Box mr={0.5}>
                      <CancelButton
                        onClick={() => {
                          setExpandeds((expandeds) =>
                            expandeds.filter(
                              (item) => item != EWalletDataType.Location,
                            ),
                          );
                        }}
                      >
                        Cancel
                      </CancelButton>
                    </Box>
                    <SaveButton
                      onClick={() => {
                        handleSubmit();
                      }}
                    >
                      Save
                    </SaveButton>
                  </Box>
                </Form>
              );
            }}
          </Formik>
        );
      default:
        return null;
    }
  };

  const isSelectAllVisible = useMemo(() => {
    return (
      UI_SUPPORTED_PERMISSIONS.some((item) => !permissions.includes(item)) &&
      isSafe(EWalletDataType.Age) &&
      isSafe(EWalletDataType.Location) &&
      isSafe(EWalletDataType.Gender)
    );
  }, [isSafe, permissions]);

  return (
    <>
      <Box
        bgcolor="#FFFFFF"
        border="1px solid #fafafa"
        borderRadius={12}
        pt={2.5}
        pb={1}
        top={48}
        position="sticky"
      >
        <Box px={1.5} mb={2.5}>
          <Typography className={classes.permissionsTitle}>
            Data Permissions
          </Typography>
        </Box>
        <Divider />
        <Box mt={1.5} px={1.5}>
          <Box mb={1.25}>
            <Typography className={classes.permissionsDescription}>
              Data you are willing to rent
            </Typography>
          </Box>
          {UI_SUPPORTED_PERMISSIONS.map((permission, index) => {
            const dataType = PERMISSIONS_WITH_ICONS[permission]!.dataType;
            const isSelected = permissions.includes(dataType);
            const valid = !isSelected ? isSafe(dataType) : true;
            return (
              <Box
                mb={2}
                key={index}
                {...(expandeds.includes(dataType) && {
                  py: 1.5,
                  px: 0.75,
                  border: "1px solid #C5C1DD",
                  borderRadius: 4,
                })}
              >
                <Box
                  bgcolor="#F2F2F8"
                  border={`1px solid ${
                    isSelected ? "#C5C1DD" : !valid ? "#F18935" : "transparent"
                  }`}
                  {...(isSelected && {
                    boxShadow: "0px 2px 0px rgba(0, 0, 0, 0.043)",
                  })}
                  borderRadius={8}
                  display="flex"
                  alignItems="center"
                  py={0.5}
                  px={1.25}
                  style={{ cursor: "pointer" }}
                  onClick={(event) => {
                    if (!valid) {
                      setExpandeds((expandeds) => [...expandeds, dataType]);
                      return;
                    }
                    onClick(dataType);
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <img
                      width={27}
                      src={PERMISSIONS_WITH_ICONS[permission]!.icon}
                    />
                    <Box ml={1.25}>
                      <Typography
                        style={{
                          fontFamily: "'Roboto'",
                          fontStyle: "normal",
                          fontWeight: 400,
                          fontSize: "12px",
                          lineHeight: "20px",
                          color: "#262626",
                        }}
                      >
                        {PERMISSIONS_WITH_ICONS[permission]!.name}
                      </Typography>
                    </Box>
                  </Box>
                  {isSelected && (
                    <Box ml="auto">
                      <img
                        width={12}
                        src={
                          "https://storage.googleapis.com/dw-assets/shared/icons/tick-primary.png"
                        }
                      />
                    </Box>
                  )}
                  {!valid && (
                    <Box ml="auto">
                      <Tooltip
                        PopperProps={{ disablePortal: true }}
                        arrow
                        title={`Looks like there is no input for your “${
                          PERMISSIONS_WITH_ICONS[permission]!.name
                        }” data click to resolve`}
                      >
                        <img
                          width={12}
                          src={
                            "https://storage.googleapis.com/dw-assets/shared/icons/exclamation.png"
                          }
                        />
                      </Tooltip>
                    </Box>
                  )}
                </Box>
                <Collapse in={expandeds.includes(dataType)} unmountOnExit>
                  {renderForm(dataType)}
                </Collapse>
              </Box>
            );
          })}
          <Box px={1.5}>
            {isSelectAllVisible ? (
              <Typography
                className={classes.selectAll}
                onClick={handleSelectAllClick}
              >
                Select All
              </Typography>
            ) : (
              <Box height={16} />
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};
