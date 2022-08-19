import artboardImage from "@extension-onboarding/assets/images/artboard.png";
import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import PrimaryButton from "@extension-onboarding/components/PrimaryButton";
import { ALERT_MESSAGES } from "@extension-onboarding/constants";
import { countries } from "@extension-onboarding/constants/countries";
import { useAppContext } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import {
  googleScopes,
  clientID,
} from "@extension-onboarding/pages/Onboarding/ProfileCreation/ProfileCreation.constants";
import { useStyles } from "@extension-onboarding/pages/Onboarding/ProfileCreation/ProfileCreation.style";
import { ApiGateway } from "@extension-onboarding/services/implementations/ApiGateway";
import { PII } from "@extension-onboarding/services/interfaces/objects/";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/sdlDataWallet/interfaces/IWindowWithSdlDataWallet";
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
  DatePicker,
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { Age, UnixTimestamp } from "@snickerdoodlelabs/objects";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Select, TextField, RadioGroup } from "formik-material-ui";

import DateFnsUtils from "@date-io/date-fns";
import { gapi } from "gapi-script";
import { ResultAsync } from "neverthrow";
import React, { FC, useEffect, useState } from "react";
import { GoogleLogin } from "react-google-login";
import * as yup from "yup";

declare const window: IWindowWithSdlDataWallet;

const ProfileCreation: FC = () => {
  const apiGateway = new ApiGateway();
  const { changeStepperStatus, addUserObject } = useAppContext();
  const { setAlert } = useLayoutContext();
  const [isGoogleButtonVisible, setGoogleButtonVisible] = useState(true);
  const [formValues, setFormValues] = useState<PII>(new PII());

  // TODO move below to right place

  const getDataFromWallet = async () => {
    const convertToSafePromise = <T, K>(
      fn: ResultAsync<T, K>,
    ): Promise<T | null> => {
      return fn.unwrapOr(null);
    };
    const [
      age,
      given_name,
      family_name,
      email,
      birthday,
      country_code,
      gender,
    ] = [
      await convertToSafePromise(window.sdlDataWallet.getAge()),
      await convertToSafePromise(window.sdlDataWallet.getGivenName()),
      await convertToSafePromise(window.sdlDataWallet.getFamilyName()),
      await convertToSafePromise(window.sdlDataWallet.getEmail()),
      await convertToSafePromise(window.sdlDataWallet.getBirthday()),
      await convertToSafePromise(window.sdlDataWallet.getLocation()),
      await convertToSafePromise(window.sdlDataWallet.getGender()),
    ];
    setFormValues(
      new PII(
        given_name,
        family_name,
        email,
        birthday ? new Date(birthday * 1000).toLocaleDateString() : null,
        country_code,
        null,
        null,
        gender,
      ),
    );
  };

  const sendDataToWallet = async (values: Partial<PII>) => {
    const convertToSafePromise = <T, K>(
      fn: ResultAsync<T, K>,
    ): Promise<T | undefined> => {
      return fn.unwrapOr(undefined);
    };
    const res = [
      ...(values.given_name
        ? [
            await convertToSafePromise(
              window.sdlDataWallet.setGivenName(values.given_name),
            ),
          ]
        : []),
      ...(values.family_name
        ? [
            await convertToSafePromise(
              window.sdlDataWallet.setFamilyName(values.family_name),
            ),
          ]
        : []),
      ...(values.email_address
        ? [
            await convertToSafePromise(
              window.sdlDataWallet.setEmail(values.email_address),
            ),
          ]
        : []),
      ...(values.date_of_birth
        ? [
            await convertToSafePromise(
              window.sdlDataWallet.setBirthday(
                (+new Date(values.date_of_birth) / 1000) as UnixTimestamp,
              ),
            ),
            await convertToSafePromise(
              window.sdlDataWallet.setAge(
                Age(
                  new Date().getFullYear() -
                    new Date(values.date_of_birth).getFullYear(),
                ),
              ),
            ),
          ]
        : []),
      ...(values.gender
        ? [
            await convertToSafePromise(
              window.sdlDataWallet.setGender(values.gender),
            ),
          ]
        : []),
      ...(values.country_code
        ? [
            await convertToSafePromise(
              window.sdlDataWallet.setLocation(values.country_code),
            ),
          ]
        : []),
    ];
  };

  const schema = yup.object().shape({
    given_name: yup.string().required("First Name is required").nullable(),
    family_name: yup.string().required("Last Name is required").nullable(),
    email_address: yup
      .string()
      .email()
      .required("Email Address is required")
      .typeError("Please enter valid Email Address!")
      .nullable(),
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

  const onFormSubmit = (values: PII) => {
    sendDataToWallet(values);
    changeStepperStatus("next");
    addUserObject(values);
  };

  const classes = useStyles();
  return (
    <Box mt={15}>
      <Box display="flex">
        <Box width={700}>
          <Typography className={classes.title}>Built your Profile</Typography>
          <Box mb={5} mt={4}>
            <Typography className={classes.description}>
              This information is for your data wallet. No one has access to
              this
              <br></br> or any other information in your data wallet unless you
              choose to <br></br> share it with them!
            </Typography>
            {isGoogleButtonVisible && (
              <>
                <Box mt={5} mb={2}>
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
              </>
            )}
          </Box>

          <Box>
            <Box>
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
                      <Box display="flex">
                        <Box>
                          <Box>
                            <FormLabel className={classes.formLabel}>
                              First Name
                            </FormLabel>
                          </Box>
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
                          <Box>
                            <FormLabel className={classes.formLabel}>
                              Last Name
                            </FormLabel>
                          </Box>
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
                      </Box>
                      <Box display="flex" mt={3}>
                        <Box>
                          <Box>
                            <FormLabel className={classes.formLabel}>
                              Email Address
                            </FormLabel>
                          </Box>
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
                        </Box>
                        <Box ml={3}>
                          <Box>
                            <FormLabel className={classes.formLabel}>
                              Date of Birth
                            </FormLabel>
                          </Box>
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
                        </Box>
                      </Box>
                      <Box display="flex" mt={3}>
                        <Box>
                          <Box>
                            <FormLabel className={classes.formLabel}>
                              Country
                            </FormLabel>
                          </Box>
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

                        <Box ml={3}>
                          <Box>
                            <FormLabel className={classes.formLabel}>
                              Gender
                            </FormLabel>
                          </Box>
                          <Box mt={1}>
                            <Field
                              component={RadioGroup}
                              row
                              required
                              name="gender"
                              value={values.gender}
                              onChange={(event) => {
                                setFieldValue(
                                  "gender",
                                  event.currentTarget.value,
                                );
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
        </Box>
        <Box className={classes.artboardImageContainer}>
          <img src={artboardImage} />
        </Box>
      </Box>
      <Box className={classes.buttonContainer}>
        <Button
          onClick={() => {
            changeStepperStatus("back");
          }}
        >
          Back
        </Button>
        <Box>
          <PrimaryButton type="submit" form="profile-create-form">
            Next
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
};
export default ProfileCreation;
