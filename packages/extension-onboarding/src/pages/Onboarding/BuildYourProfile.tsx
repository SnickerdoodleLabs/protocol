import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
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

const BuildYourProfile: FC = () => {
  const [age, setAge] = React.useState("");

  const handleChange = (event: any) => {
    setAge(event.target.value);
  };

  const classes = useStyles();
  return (
    <Grid style={{ display: "flex" }}>
      <Grid>
        <h3 className={classes.buildYourProfileText}>Build your Profile</h3>
        <p className={classes.infoText}>
          This information is for your data wallet. No one has access to this
          <br></br> or any other information in your data wallet unless you
          choose to<br></br> share it with them!
        </p>

        <Grid style={{ display: "flex" }}>
          <Grid>
            <Grid>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Gender
              </FormLabel>
            </Grid>
            <InputBase
              autoFocus={true}
              className={classes.textInput}
              placeholder="First name"
            />
          </Grid>

          <Grid style={{ marginLeft: "20px" }}>
            <Grid>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Gender
              </FormLabel>
            </Grid>
            <InputBase
              autoFocus={true}
              className={classes.textInput}
              placeholder="Last name"
            />
          </Grid>
        </Grid>

        <Grid style={{ display: "flex", marginTop: "25px" }}>
          <Grid>
            <Grid>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Gender
              </FormLabel>
            </Grid>
            <InputBase
              autoFocus={true}
              className={classes.textInput}
              placeholder="abc@abc.com"
            />
          </Grid>
          <Grid style={{ marginLeft: "20px" }}>
            <Grid>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Gender
              </FormLabel>
            </Grid>
            <Select
              value={age}
              onChange={handleChange}
              displayEmpty
              className={classes.selectInput}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </Grid>
        </Grid>

        <Grid style={{ display: "flex", marginTop: "25px" }}>
          <Grid>
            <Grid>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Gender
              </FormLabel>
            </Grid>

            <Select
              value={age}
              onChange={handleChange}
              displayEmpty
              className={classes.selectInput}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </Grid>
          <FormControl style={{ marginLeft: "20px" }}>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Gender
            </FormLabel>
            <RadioGroup
              style={{ paddingTop: "10px" }}
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Non-Binary"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <h3 className={classes.authorizeText}>
          Or Authorize Snickerdoodle to Connect Your Google Profile
        </h3>
        <Button className={classes.googleButton}>
          <Grid style={{ display: "flex" }}>
            <img src={googleIcon} />
            <p className={classes.googleButtonText}>Authorize with Google</p>
          </Grid>
        </Button>
      </Grid>

      <Grid className={classes.artboard}>
        <img src={artboard} />
      </Grid>
    </Grid>
  );
};
const useStyles = makeStyles({
  artboard: {
    marginTop: "100px",
    marginLeft: "20px",
  },
  googleButtonText: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "12px",
    fontWeight: 500,
    color: "black",
    letterSpacing: "1px",
    paddingLeft: "15px",
  },
  googleButton: {
    width: "330px",
    height: "52px",
    border: "1px solid #D9D9D9",
    borderRadius: "8px",
  },
  authorizeText: {
    marginTop: "40px",
    color: "#232039",
    fontFamily: "'Shrikhand'",
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

export default BuildYourProfile;
