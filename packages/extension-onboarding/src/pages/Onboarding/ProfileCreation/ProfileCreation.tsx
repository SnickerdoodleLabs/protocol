import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Box,
  InputBase,
  MenuItem,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import React, { FC, useEffect, useState } from "react";
import artboard from "@extension-onboarding/assets/icons/artboard.png";
import { makeStyles } from "@material-ui/styles";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { gapi } from "gapi-script";
import PrimaryButton from "@extension-onboarding/components/PrimaryButton";
import { useAppContext } from "@extension-onboarding/Context/App";
import { useStyles } from "@extension-onboarding/pages/Onboarding/ProfileCreation/ProfileCreation.style";
import {
  googleScopes,
  clientID,
} from "@extension-onboarding/pages/Onboarding/ProfileCreation/ProfileCreation.constants";
import { CoreText } from "@extension-onboarding/services/implementations/CoreText";
import { Formik, Form, Field } from "formik";
import { TextField, Select } from "formik-material-ui";
import * as yup from "yup";
import { PII } from "@extension-onboarding/services/interfaces/objects/";

const ProfileCreation: FC = () => {
  const coreText = new CoreText();
  const { changeStepperStatus, addUserObject } = useAppContext();
  const [formValues, setFormValues] = useState<PII>(new PII());

  {
    /*  const validationSchema = yup.object({
    email: yup
      .string("Enter your email")
      .email("Enter a valid email")
      .required("Email is required"),
    password: yup
      .string("Enter your password")
      .min(8, "Password should be of minimum 8 characters length")
      .required("Password is required"),
  }); */
  }
  const onFormSubmit = (values: PII) => {
    console.log(values);
  };

  const [firstName, setFirstName] = React.useState<string | null>("");
  const [lastName, setLastName] = React.useState<string | null>("");
  const [emailAddress, setEmailAddress] = React.useState<string | null>("");
  const [birthday, setBirthday] = React.useState<string | null>("");
  const [country, setCountry] = React.useState<string | null>("");
  const [gender, setGender] = React.useState<string | null>("");

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
    coreText.PIIService.fetchPIIFromGoogle(
      res?.tokenObj?.access_token,
      res?.googleId,
    ).map((res) => {
   setFormValues(res);
    });
  };
  const onFailure = (res) => {
    console.log("googleResFail", res);
  };

  const formSubmit = (e: any) => {
    e.preventDefault();
    addUserObject({
      firstName,
      lastName,
      emailAddress,
      birthday,
      country,
      gender,
    });
    changeStepperStatus("next");
  };

  const firstNameHandleChange = (event: any) => {
    setFirstName(event.target.value);
  };
  const lastNameHandleChange = (event: any) => {
    setLastName(event.target.value);
  };
  const emailHandleChange = (event: any) => {
    setEmailAddress(event.target.value);
  };
  const birthdayHandleChange = (event: any) => {
    setBirthday(event.target.value);
  };
  const countryHandleChange = (event: any) => {
    setCountry(event.target.value);
  };
  const genderHandleChange = (event: any) => {
    setGender(event.target.value);
  };

  const classes = useStyles();
  return (
    <Box>
      <Formik initialValues={formValues} onSubmit={onFormSubmit} enableReinitialize>
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
  {/* 
  
     <Box>
          <h3 className={classes.buildYourProfileText}>Build your Profile</h3>
          <p className={classes.infoText}>
            This information is for your data wallet. No one has access to this
            <br></br> or any other information in your data wallet unless you
            choose to<br></br> share it with them!
          </p>

          <form onSubmit={formSubmit}>
            <Box>
              <Box display="flex">
                <Box>
                  <Box>
                    <FormLabel>First Name</FormLabel>
                  </Box>
                  <InputBase
                    value={firstName}
                    onChange={firstNameHandleChange}
                    autoFocus={true}
                    className={classes.textInput}
                    required
                    placeholder="First name"
                  />
                </Box>

                <Box style={{ marginLeft: "20px" }}>
                  <Box>
                    <FormLabel>Last Name</FormLabel>
                  </Box>
                  <InputBase
                    value={lastName}
                    onChange={lastNameHandleChange}
                    autoFocus={true}
                    className={classes.textInput}
                    required
                    placeholder="Last name"
                  />
                </Box>
              </Box>

              <Box style={{ display: "flex", marginTop: "25px" }}>
                <Box>
                  <Box>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      Email Address
                    </FormLabel>
                  </Box>
                  <InputBase
                    value={emailAddress}
                    onChange={emailHandleChange}
                    autoFocus={true}
                    className={classes.textInput}
                    required
                    placeholder="abc@abc.com"
                  />
                </Box>
                <Box style={{ marginLeft: "20px" }}>
                  <Box>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      Date of Birthday
                    </FormLabel>
                  </Box>
                  <InputBase
                    value={birthday}
                    onChange={birthdayHandleChange}
                    autoFocus={true}
                    className={classes.textInput}
                    placeholder="../../...."
                  />
                </Box>
              </Box>

              <Box style={{ display: "flex", marginTop: "25px" }}>
                <Box>
                  <Box>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      Country
                    </FormLabel>
                  </Box>
                  
 <Select
                    value={country}
                    onChange={countryHandleChange}
                    displayEmpty
                    className={classes.selectInput}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>United States</MenuItem>
                    <MenuItem value={20}>United Kingdom</MenuItem>
                  </Select>
                </Box>
                <FormControl style={{ marginLeft: "20px" }}>
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    Gender
                  </FormLabel>
                  <RadioGroup
                    value={gender}
                    style={{ paddingTop: "10px" }}
                    onChange={genderHandleChange}
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
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
                      value="other"
                      control={<Radio />}
                      label="Non-Binary"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Box>
          </form>
          <h3 className={classes.authorizeText}>
            Or Sign in Snickerdoodle to Connect your Google Profile
          </h3>

          <GoogleLogin
            clientId={clientID}
            className={classes.googleButton}
            buttonText="Sign in with Google"
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={"single_host_origin"}
            isSignedIn={true}
          />
        </Box>

        <Box className={classes.artboard}>
          <img src={artboard} />
        </Box>
  */}
      <Box display="flex">
     
      </Box>
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
  );
};
export default ProfileCreation;
