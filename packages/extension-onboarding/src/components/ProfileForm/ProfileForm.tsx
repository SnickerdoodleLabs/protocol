import DateFnsUtils from "@date-io/date-fns";
import { countries } from "@extension-onboarding/constants/countries";
import useProfileIFormLogic from "@extension-onboarding/hooks/useProfileIFormLogic";
import { useStyles } from "@extension-onboarding/pages/Onboarding/ProfileCreation/ProfileCreation.style";
import {
  Box,
  FormControlLabel,
  Radio,
  Typography,
  MenuItem,
} from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Select, RadioGroup } from "formik-material-ui";
import React, { FC, useEffect } from "react";
import { GoogleLogin } from "react-google-login";

interface ProfileFormProps {
  onSubmitted?: () => void;
}

const ProfileForm: FC<ProfileFormProps> = ({
  onSubmitted,
}: ProfileFormProps) => {
  const {
    isGoogleButtonVisible,
    onGoogleLoginFail,
    onGoogleLoginSuccess,
    formValues,
    onFormSubmit,
    schema,
    isSubmitted,
    gapiClientID,
  } = useProfileIFormLogic();
  const classes = useStyles();

  useEffect(() => {
    if (isSubmitted) onSubmitted?.();
  }, [isSubmitted]);

  return (
    <Box>
      <Box mb={5} mt={4}>
        {/* {isGoogleButtonVisible && (
          <Box my={5}>
            <Box mb={2}>
              <Typography className={classes.socialLoginTitle}>
                Build your Profile by Linking your Data from Google
              </Typography>
            </Box>
            <GoogleLogin
              clientId={gapiClientID}
              className={classes.googleButton}
              buttonText="Link your data from Google"
              onSuccess={onGoogleLoginSuccess}
              onFailure={onGoogleLoginFail}
              cookiePolicy={"single_host_origin"}
              isSignedIn={false}
            />
          </Box>
        )} */}
        <Formik
          initialValues={formValues}
          onSubmit={onFormSubmit}
          enableReinitialize
          validationSchema={schema}
        >
          {({ handleSubmit, values, setFieldValue }) => {
            return (
              <Form noValidate onSubmit={handleSubmit} id="profile-create-form">
                {/*          <Box display="flex">
                  <Box>
                    <Typography className={classes.formLabel}>
                      First Name
                    </Typography>
                    <Field
                      className={classes.input}
                      component={TextField}
                      variant="outlined"
                      name="given_name"
                      type="text"
                      placeholder="First Name"
                      required
                      value={values.given_name}
                    />
                  </Box>
                  <Box ml={3}>
                    <Typography className={classes.formLabel}>
                      Last Name
                    </Typography>
                    <Field
                      className={classes.input}
                      component={TextField}
                      variant="outlined"
                      name="family_name"
                      type="text"
                      placeholder="Last Name"
                      value={values.family_name}
                    />
                  </Box>
                </Box> */}

                <Box /* display="flex" */ mt={3}>
                  <Box>
                    <Typography className={classes.formLabel}>
                      Country (Optional)
                    </Typography>
                    <Field
                      className={classes.selectInput}
                      component={Select}
                      variant="outlined"
                      fullWidth
                      name="country_code"
                      placeholder="Select your country"
                      value={
                        values.country_code
                        //  ||
                        // (() => {
                        //   setFieldValue("country_code", "US");
                        //   return "US";
                        // })()
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
                  {/* todo delete mt */}
                </Box>

                <Box display="flex" mt={3}>
                  {/*     <Box>
                    <Typography className={classes.formLabel}>
                      Email Address
                    </Typography>
                    <Field
                      className={classes.input}
                      component={TextField}
                      variant="outlined"
                      fullWidth
                      name="email_address"
                      type="email"
                      placeholder="Email Address"
                      value={values.email_address}
                    />
                  </Box> */}
                  <Box /* ml={3} */>
                    <Typography className={classes.formLabel}>
                      Date of Birth (Optional)
                    </Typography>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        className={classes.input}
                        required
                        clearable
                        autoOk
                        variant="inline"
                        placeholder="Date of Birth (MM/DD/YYYY)"
                        inputVariant="outlined"
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
                </Box>
                <Box /* display="flex" */ mt={3}>
                  <Box>
                    <Typography className={classes.formLabel}>
                      Gender (Optional)
                    </Typography>
                    <Field
                      className={classes.selectInput}
                      component={Select}
                      variant="outlined"
                      fullWidth
                      placeholder="Select your gender"
                      name="gender"
                      value={values.gender}
                    /*   onChange={(event) => {
                        setFieldValue("gender", event.currentTarget.value);
                      }} */
                    >
                      <MenuItem selected value="female">
                        Female
                      </MenuItem>

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
                  {/* todo delete mt */}
                </Box>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </Box>
  );
};
export default ProfileForm;
