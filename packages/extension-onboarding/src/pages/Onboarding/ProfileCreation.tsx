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
  Select,
} from "@material-ui/core";
import React, { FC, useEffect, useState } from "react";
import artboard from "@extension-onboarding/assets/icons/artboard.png";
import googleIcon from "@extension-onboarding/assets/icons/googleIcon.svg";
import SnickerProgressBar from "@extension-onboarding/components/SnickerProgressBar";
import { makeStyles } from "@material-ui/styles";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { gapi } from "gapi-script";
import PrimaryButton from "@extension-onboarding/components/PrimaryButton";
import { useAppContext } from "@extension-onboarding/Context/App";

export interface IGoogleSignIn {
  auth_token: string;
  googleId: string;
}

const ProfileCreation: FC = () => {
  const { changeStepperStatus, addUserObject } = useAppContext();

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [birthday, setBirthday] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [gender, setGender] = React.useState("");

  const clientID =
    "332580693256-mifj8rkovvlc332n8gtllpdl93e6nvio.apps.googleusercontent.com"; // TODO Should be in .ENV
  const scopes = [
    "profile email",
    "https://www.googleapis.com/auth/user.addresses.read",
    "https://www.googleapis.com/auth/user.birthday.read",
    "https://www.googleapis.com/auth/user.gender.read",
    "https://www.googleapis.com/auth/user.phonenumbers.read",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ];
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientID,
        scope: scopes.join(" "),
      });
    }
    gapi.load("client:auth2", start);
  }, []);

  // TODO idendity IGoogleSignIn
  function populateWithGoogle(auth_token, id) {
    console.log(auth_token);
    console.log(id);
    let fetch_url = `https://people.googleapis.com/v1/people:batchGet?resourceNames=people/${id}&personFields=phoneNumbers,addresses,ageRanges,locations,names,locations,genders,birthdays,emailAddresses,biographies,clientData,locales,metadata,photos,userDefined`;
    let fetch_options = {
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    };
    fetch(fetch_url, fetch_options)
      .then((res) => res.json())
      .then((res) => {
        setFirstName(res.responses?.[0]?.person?.names?.[0]?.givenName);
        setLastName(res.responses?.[0]?.person?.names?.[0]?.familyName);
        setEmailAddress(res.responses?.[0]?.person?.emailAddresses?.[0]?.value);
        setBirthday(
          `${res.responses?.[0]?.person?.birthdays?.[0]?.date.day}/${res.responses?.[0]?.person?.birthdays?.[0]?.date.month}/${res.responses?.[0]?.person?.birthdays?.[0]?.date.year}`,
        );
        setGender(res.responses?.[0]?.person?.genders?.[0]?.value);
        console.log(res.responses?.[0]?.person);
      });
  }

  const onSuccess = (res) => {
    populateWithGoogle(res?.tokenObj?.access_token, res?.googleId);
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
    <Box style={{ display: "flex" }}>
      <Box>
        <h3 className={classes.buildYourProfileText}>Build your Profile</h3>
        <p className={classes.infoText}>
          This information is for your data wallet. No one has access to this
          <br></br> or any other information in your data wallet unless you
          choose to<br></br> share it with them!
        </p>

        <form onSubmit={formSubmit}>
          <Box>
            <Box style={{ display: "flex" }}>
              <Box>
                <Box>
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    First Name
                  </FormLabel>
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
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    Last Name
                  </FormLabel>
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
          <Box
            style={{
              position: "absolute",
              top: "750px",
              right: "200px",
              marginTop: "140px",
              display: "flex",
            }}
          >
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
    </Box>
  );
};
const useStyles = makeStyles({
  artboard: {
    marginTop: "100px",
    marginLeft: "20px",
  },
  googleButton: {
    width: "330px !important",
    height: "52px !important",
    border: "1px solid #D9D9D9 !important",
    borderRadius: "8px !important",
    fontFamily: "'Space Grotesk', sans-serif !important",
    fontSize: "14px !important",
    fontWeight: 500,
    color: "black !important",
    letterSpacing: "1px !important",
    justifyContent: "center",
  },
  authorizeText: {
    marginTop: "40px",
    color: "#232039",
    fontFamily: "'Space Grotesk'",
    fontSize: "18px",
  },
  selectInput: {
    width: "330px",
    height: "55px",
    border: "1px solid #D9D9D9",
    borderRadius: "8px",
    paddingLeft: "25px",
    color: "#929292",
  },
  textInput: {
    border: "1px solid #D9D9D9",
    width: "330px",
    height: "55px",
    borderRadius: "8px",
    paddingLeft: "25px",
    color: "#929292",
  },
  buildYourProfileText: {
    fontSize: "36px",
    fontWeight: 400,
    fontStyle: "italic",
    fontFamily: " 'Shrikhand', cursive ",
    marginTop: "100px",
  },
  infoText: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 400,
    fontSize: "18px",
  },
});

export default ProfileCreation;
