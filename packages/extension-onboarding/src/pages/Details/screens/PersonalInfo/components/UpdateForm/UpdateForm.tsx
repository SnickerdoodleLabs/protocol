import DateFnsUtils from "@date-io/date-fns";
import { countries } from "@extension-onboarding/constants/countries";
import useProfileIFormLogic from "@extension-onboarding/hooks/useProfileIFormLogic";
import { clientID } from "@extension-onboarding/pages/Onboarding/ProfileCreation/ProfileCreation.constants";
import {
  useStyles,
  usePopoverStyles,
} from "@extension-onboarding/pages/Details/screens/PersonalInfo/components/UpdateForm/UpdateForm.style";
import calendarIcon from "@extension-onboarding/assets/icons/calendar.svg";

import { Box, Typography, MenuItem, Grid, Button } from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Select, RadioGroup } from "formik-material-ui";
import React, { FC, useEffect } from "react";
import { GoogleLogin } from "react-google-login";

interface IUpdateFormProps {
  onSubmitted: () => void;
  onCancelClicked: () => void;
}

const UpdateForm: FC<IUpdateFormProps> = ({
  onSubmitted,
  onCancelClicked,
}: IUpdateFormProps) => {
  const {
    isGoogleButtonVisible,
    onGoogleLoginFail,
    onGoogleLoginSuccess,
    formValues,
    onFormSubmit,
    schema,
    isSubmitted,
  } = useProfileIFormLogic();
  const classes = useStyles();
  const popoverClasses = usePopoverStyles();

  useEffect(() => {
    if (isSubmitted) onSubmitted?.();
  }, [isSubmitted]);

  return (
    <Box>
      <Box mb={5}>
        {isGoogleButtonVisible && (
          <Box my={5}>
            <Box mb={2}>
              <Typography className={classes.info}>
                Sync your demographic info by connecting your Google account.
              </Typography>
            </Box>
            <GoogleLogin
              clientId={clientID}
              className={classes.googleButton}
              buttonText="Link your data from Google"
              onSuccess={onGoogleLoginSuccess}
              onFailure={onGoogleLoginFail}
              cookiePolicy={"single_host_origin"}
              isSignedIn={false}
            />
            <Box mt={2} display="flex" alignItems="center">
              <Box mr={1} className={classes.divider} />
              <Typography className={classes.dividerText}>
                or input it manually
              </Typography>
              <Box ml={1} className={classes.divider} />
            </Box>
          </Box>
        )}
        <Box
          mt={4}
          bgcolor="#FCFCFC"
          p={3}
          pt={6}
          border="1px solid #ECECEC"
          borderRadius={8}
        >
          <Box display="flex">
            <Box display="flex" marginLeft="auto">
              <Button
                onClick={onCancelClicked}
                className={classes.actionButton}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="profile-create-form"
                className={classes.actionButton}
              >
                Save
              </Button>
            </Box>
          </Box>
          <Formik
            initialValues={formValues}
            onSubmit={onFormSubmit}
            enableReinitialize
            validationSchema={schema}
          >
            {({ handleSubmit, values, setFieldValue }) => {
              return (
                <Form
                  noValidate
                  onSubmit={handleSubmit}
                  id="profile-create-form"
                >
                  <Grid spacing={3} container>
                    <Grid item xs={6}>
                      <Typography className={classes.formLabel}>
                        Date of Birth
                      </Typography>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          keyboardIcon={<img src={calendarIcon} />}
                          className={classes.input}
                          fullWidth
                          required
                          clearable
                          autoOk
                          variant="inline"
                          placeholder="Date of Birth (MM/DD/YYYY)"
                          inputVariant="outlined"
                          format="MM/dd/yyyy"
                          id="date-picker-inline"
                          PopoverProps={{ classes: popoverClasses }}
                          invalidDateMessage=""
                          maxDateMessage=""
                          minDateMessage=""
                          onError={(e) => console.log(e)}
                          value={values.date_of_birth}
                          onChange={(date, value) => {
                            setFieldValue(
                              "date_of_birth",
                              date?.toString() === "Invalid Date"
                                ? date
                                : value,
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
                      <Typography className={classes.infoText}>
                        Your Date of Birth will never be shared without your
                        consent.
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <Typography className={classes.formLabel}>
                          Country
                        </Typography>
                        <Field
                          className={classes.selectInput}
                          component={Select}
                          variant="outlined"
                          fullWidth
                          name="country_code"
                          placeholder="Country"
                          value={
                            values.country_code ||
                            (() => {
                              setFieldValue("country_code", "US");
                              return "US";
                            })()
                          }
                        >
                          <MenuItem selected value="US">
                            United States
                          </MenuItem>
                          {countries.map((country) => (
                            <MenuItem key={country.code} value={country.code}>
                              {country.name}
                            </MenuItem>
                          ))}
                        </Field>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <Typography className={classes.formLabel}>
                          Gender
                        </Typography>
                        <Field
                          className={classes.selectInput}
                          component={Select}
                          variant="outlined"
                          fullWidth
                          name="gender"
                          placeholder="Gender"
                          value={values.gender || ""}
                          inputProps={{
                            displayEmpty: true,
                          }}
                        >
                          <MenuItem value="" disabled>
                            Select your gender
                          </MenuItem>
                          <MenuItem value="female">Female</MenuItem>
                          <MenuItem value="male">Male</MenuItem>
                          <MenuItem value="nonbinary">Non-Binary</MenuItem>
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
                    </Grid>
                  </Grid>
                </Form>
              );
            }}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
};
export default UpdateForm;
