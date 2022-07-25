import {
  Button,
  Box,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import React, { FC, useEffect, useState } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { gapi } from "gapi-script";
import PrimaryButton from "@extension-onboarding/components/PrimaryButton";
import { useAppContext } from "@extension-onboarding/context/App";
import { useStyles } from "@extension-onboarding/pages/Onboarding/ProfileCreation/ProfileCreation.style";
import {
  googleScopes,
  clientID,
} from "@extension-onboarding/pages/Onboarding/ProfileCreation/ProfileCreation.constants";
import { ApiGateway } from "@extension-onboarding/services/implementations/ApiGateway";
import { Formik, Form, Field } from "formik";
import { Select, TextField } from "formik-material-ui";
import * as yup from "yup";
import { PII } from "@extension-onboarding/services/interfaces/objects/";
import artboardImage from "@extension-onboarding/assets/images/artboard.png";

const ProfileCreation: FC = () => {
  const apiGateway = new ApiGateway();
  const { changeStepperStatus, addUserObject } = useAppContext();
  const [formValues, setFormValues] = useState<PII>(new PII());

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientID,
        scope: googleScopes,
      });
    }
    gapi.load("client:auth2", start);
  }, []);

  const onSuccess = (res) => {
    apiGateway.PIIService.fetchPIIFromGoogle(
      res?.tokenObj?.access_token,
      res?.googleId,
    ).map((res) => {
      setFormValues(res);
    });
  };
  const onFailure = (res) => {
    console.log("googleResFail", res);
  };

  const onFormSubmit = (values: PII) => {
  changeStepperStatus('next');
  addUserObject(values);
  };

  const classes = useStyles();
  return (
    <Box mt={15}>
         
      <Box display="flex">
        <Box width={700}>
          <Typography className={classes.title}>
            Built for All Chains
          </Typography>
          <Box mb={5} mt={4}>
            <Typography className={classes.description}>
              This information is for your data wallet. No one has access to
              this
              <br></br> or any other information in your data wallet unless you
              choose to <br></br> share it with them!
            </Typography>
          </Box>

          <Box>
            
            <Box>
            <Formik
                initialValues={formValues}
                onSubmit={onFormSubmit}
                enableReinitialize
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
                              Date of Birthday
                            </FormLabel>
                          </Box>
                          <Field
                            className={classes.input}
                            component={TextField}
                            variant="outlined"
                            fullWidth
                            name="date_of_birth"
                            type="text"
                            placeholder="Date of Birth"
                            value={values.date_of_birth}
                          />
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
                            className={classes.input}
                            component={Select}
                            variant="outlined"
                            fullWidth
                            name="country_code"
                            placeholder="Country"
                            value={values.country_code || "US"}
                          >
                            <option selected value="US">
                              United States
                            </option>
                            <option value="red">Red</option>
                            <option value="green">Green</option>
                            <option value="blue">Blue</option>
                          </Field>
                        </Box>

                        <Box ml={3}>
                          <Box>
                            <FormLabel className={classes.formLabel}>
                              Gender
                            </FormLabel>
                          </Box>
                          <Box mt={1}>
                            <RadioGroup
                              row
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
                                value="non-binary"
                                control={<Radio />}
                                label="Non-Binary"
                              />
                            </RadioGroup>
                          </Box>
                        </Box>
                      </Box>

                      <Box mt={5} mb={2}>
                        <Typography className={classes.socialLoginTitle}>
                          Or Build your Profile by Linking your Data from Google
                        </Typography>
                      </Box>
                      <GoogleLogin
                        clientId={clientID}
                        className={classes.googleButton}
                        buttonText="Link your data from Google"
                        onSuccess={onSuccess}
                        onFailure={onFailure}
                        cookiePolicy={"single_host_origin"}
                        isSignedIn={true}
                      />
                      
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
          <PrimaryButton
            type="submit"
            form="profile-create-form"
          >
            Next
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
};
export default ProfileCreation;

{
  /*
  <Box>
      <Formik
        initialValues={formValues}
        onSubmit={onFormSubmit}
        enableReinitialize
      >
        {({ handleSubmit, values, setFieldValue }) => {
          return (
            <Form noValidate onSubmit={handleSubmit} id="profile-create-form">
              <Field
                component={TextField}
                fullWidth
                name="given_name"
                type="text"
                placeholder="First Name"
                value={values.given_name}
              />
              <Field
                component={TextField}
                fullWidth
                name="family_name"
                type="text"
                placeholder="Last Name"
                value={values.family_name}
              />
              <Field
                component={TextField}
                fullWidth
                name="email_address"
                type="email"
                placeholder="Email Address"
                value={values.email_address}
              />
              <Field
                component={TextField}
                fullWidth
                name="date_of_birth"
                type="text"
                placeholder="Date of Birth"
                value={values.date_of_birth}
              />
              <Field
                component={Select}
                fullWidth
                name="country_code"
                placeholder="Country"
                values={values.country_code}
              >
                <option value="red">Red</option>
                <option value="green">Green</option>
                <option value="blue">Blue</option>
              </Field>

              <div role="group" aria-labelledby="my-radio-group">
                <label>
                  <Field type="radio" name="gender" value="male" />
                  Male
                </label>
                <label>
                  <Field type="radio" name="gender" value="female" />
                  Female
                </label>
                <label>
                  <Field type="radio" name="gender" value="non-binary" />
                  Non-Binary
                </label>
              </div>
            </Form>
          );
        }}
      </Formik>

      <GoogleLogin
        clientId={clientID}
        className={classes.googleButton}
        buttonText="Sign in with Google"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
        isSignedIn={true}
      />

      <Box className={classes.buttonContainer}>
        <Button
          onClick={() => {
            changeStepperStatus("back");
          }}
        >
          Back
        </Button>
        <PrimaryButton
          type="submit"
          onClick={() => {
            changeStepperStatus("next");
          }}
        >
          Next
        </PrimaryButton>
      </Box>
    </Box>
  */
}
