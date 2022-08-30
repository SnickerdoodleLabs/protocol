import DateFnsUtils from "@date-io/date-fns";
import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import { ALERT_MESSAGES } from "@extension-onboarding/constants";
import { countries } from "@extension-onboarding/constants/countries";
import { useAppContext } from "@extension-onboarding/context/App";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import {
  googleScopes,
  clientID,
} from "@extension-onboarding/pages/Onboarding/ProfileCreation/ProfileCreation.constants";
import { useStyles } from "@extension-onboarding/pages/Onboarding/ProfileCreation/ProfileCreation.style";
import { PII } from "@extension-onboarding/services/interfaces/objects/";
import {
  Button,
  Box,
  FormLabel,
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
import { Select, TextField, RadioGroup } from "formik-material-ui";
import { gapi } from "gapi-script";
import React, { FC, useEffect, useState } from "react";
import { GoogleLogin } from "react-google-login";
import * as yup from "yup";
interface ProfileFormProps {
  onSubmitted?: () => void;
}

const ProfileForm: FC<ProfileFormProps> = ({
  onSubmitted,
}: ProfileFormProps) => {
  const { apiGateway, dataWalletGateway } = useAppContext();
  const { setAlert } = useNotificationContext();
  const [isGoogleButtonVisible, setGoogleButtonVisible] = useState(true);
  const [formValues, setFormValues] = useState<PII>(new PII());

  const getDataFromWallet = () => {
    dataWalletGateway.profileService.getProfile().map((profileInfo) => {
      setFormValues(profileInfo);
    });
  };

  const sendDataToWallet = async (values: Partial<PII>) => {
    await dataWalletGateway.profileService.setProfile(values);
  };

  const schema = yup.object().shape({
  /*   given_name: yup.string().required("First Name is required").nullable(),
    family_name: yup.string().required("Last Name is required").nullable(),
    email_address: yup
      .string()
      .email()
      .required("Email Address is required")
      .typeError("Please enter valid Email Address!")
      .nullable(), */
    date_of_birth: yup
      .date()
      .max(new Date(), "Please enter valid Date!")
      .required("Date of Birth is required")
      .typeError("Please enter valid Date!")
      .nullable(),
    gender: yup.string().required("Gender is required").nullable(),
  });

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientID,
        scope: googleScopes,
      });
    }
    gapi.load("client:auth2", start);
    getDataFromWallet();
  }, []);

  const onSuccess = (res) => {
    apiGateway.PIIService.fetchPIIFromGoogle(
      res?.tokenObj?.access_token,
      res?.googleId,
    ).map((res) => {
      setFormValues(res);
      setGoogleButtonVisible(false);
      setAlert({
        message: ALERT_MESSAGES.PROFILE_FILLED_WITH_GOOGLE_DATA,
        severity: EAlertSeverity.SUCCESS,
      });
    });
  };
  const onFailure = (res) => {
    console.log("googleResFail", res);
  };

  const onFormSubmit = async (values: PII) => {
    await sendDataToWallet(values);
    onSubmitted?.();
  };

  const classes = useStyles();
  return (
    <Box>
      <Box mb={5} mt={4}>
        {isGoogleButtonVisible && (
          <Box my={5}>
            <Box mb={2}>
              <Typography className={classes.socialLoginTitle}>
                Build your Profile by Linking your Data from Google
              </Typography>
            </Box>
            <GoogleLogin
              clientId={clientID}
              className={classes.googleButton}
              buttonText="Link your data from Google"
              onSuccess={onSuccess}
              onFailure={onFailure}
              cookiePolicy={"single_host_origin"}
              isSignedIn={false}
            />
          </Box>
        )}
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
                      Date of Birth
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
                        onError={(e) => console.log(e)}
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
                  {/* todo delete mt */}
                  <Box /* ml={3} */ mt={3}>
                    <Typography className={classes.formLabel}>
                      Gender
                    </Typography>
                    <Box mt={1}>
                      <Field
                        component={RadioGroup}
                        row
                        required
                        name="gender"
                        value={values.gender}
                        onChange={(event) => {
                          setFieldValue("gender", event.currentTarget.value);
                        }}
                      >
                        <FormControlLabel
                          value="female"
                          control={<Radio />}
                          label="Female"
                        />
                        <FormControlLabel
                          value="male"
                          control={<Radio />}
                          label="Male"
                        />
                        <FormControlLabel
                          value="nonbinary"
                          control={<Radio />}
                          label="Non-Binary"
                        />
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
                  </Box>
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
