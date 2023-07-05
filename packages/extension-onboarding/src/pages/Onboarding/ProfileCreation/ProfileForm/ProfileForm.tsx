import DateFnsUtils from "@date-io/date-fns";
import { countries } from "@extension-onboarding/constants/countries";
import useProfileIFormLogic from "@extension-onboarding/hooks/useProfileIFormLogic";
import { useStyles } from "@extension-onboarding/pages/Onboarding/ProfileCreation/ProfileCreation.style";
import {
  Box,
  Grid,
  CircularProgress,
  Typography,
  MenuItem,
} from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { useDatePickerPopoverStyles } from "@snickerdoodlelabs/shared-components";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Select, RadioGroup } from "formik-material-ui";
import React, { FC, useEffect } from "react";
import { GoogleLogin } from "react-google-login";
import artboardImage from "@extension-onboarding/assets/images/artboard.svg";
import { Button } from "@snickerdoodlelabs/shared-components";

import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  useEffect(() => {
    if (isSubmitted) navigate(EPaths.ONBOARDING_TAG_SELECTION);
  }, [isSubmitted]);
  const popoverClasses = useDatePickerPopoverStyles();
  return (
    <Box>
      <Box mb={5} mt={4}>
        <Formik
          initialValues={formValues}
          onSubmit={onFormSubmit}
          enableReinitialize
          validationSchema={schema}
        >
          {({ handleSubmit, values, setFieldValue, isSubmitting }) => {
            return (
              <Form noValidate onSubmit={handleSubmit} id="profile-create-form">
                <Grid container alignItems="flex-start">
                  <Grid item sm={8}>
                    <Box pr={8}>
                      <Typography className={classes.title}>
                        More Information = More Rewards!
                      </Typography>
                      <Box mb={5} mt={4}>
                        <Typography className={classes.description}>
                          No one can access this personal information, not even
                          Snickerdoodle.<br></br>
                          YOU use Snickerdoodle to anonymize your data and rent
                          it out to<br></br>
                          brands of your choice, directly.
                          <br />
                          <br />
                          Add more information to maximize reward opportunities
                          while keeping<br></br>
                          your data securely in one place.
                        </Typography>
                        <Box mt={3}>
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
                              value={values.country_code}
                            >
                              <MenuItem selected value="US">
                                United States
                              </MenuItem>
                              {countries.map((country) => (
                                <MenuItem
                                  key={country.code}
                                  value={country.code}
                                >
                                  {country.name}
                                </MenuItem>
                              ))}
                            </Field>
                          </Box>
                        </Box>

                        <Box display="flex" mt={3}>
                          <Box>
                            <Typography className={classes.formLabel}>
                              Date of Birth (Optional)
                            </Typography>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <KeyboardDatePicker
                                disabled={isSubmitting}
                                className={classes.input}
                                PopoverProps={{
                                  classes: popoverClasses,
                                }}
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
                        <Box mt={3}>
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
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item sm={4}>
                    <Box mb={3}>
                      <img src={artboardImage} style={{ width: "100%" }} />
                    </Box>
                    <Button disabled={isSubmitting} fullWidth type="submit">
                      Next
                      {isSubmitting && (
                        <span>
                          <Box ml={2}>
                            <CircularProgress size={16} />
                          </Box>
                        </span>
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </Box>
  );
};
export default ProfileForm;
