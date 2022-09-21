import DateFnsUtils from "@date-io/date-fns";
import { countries } from "@extension-onboarding/constants/countries";
import useProfileIFormLogic from "@extension-onboarding/hooks/useProfileIFormLogic";
import { clientID } from "@extension-onboarding/pages/Onboarding/ProfileCreation/ProfileCreation.constants";
import { useStyles } from "@extension-onboarding/pages/Details/screens/PersonalInfo/components/UpdateForm/UpdateForm.style";

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

interface IUpdateFormProps {
  onSubmitted?: () => void;
}

const UpdateForm: FC<IUpdateFormProps> = ({
  onSubmitted,
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

  useEffect(() => {
    if (isSubmitted) onSubmitted?.();
  }, [isSubmitted]);

  return (
    <Box>
      <Box mb={5} mt={4}>
        {isGoogleButtonVisible && (
          <Box my={5}>
            <Box>
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
            <Box display="flex" alignItems="center">
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
          pt={12}
          border="1px solid #ECECEC"
          borderRadius={8}
        >
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
                  <Box display="flex" mt={3}>
                    <Box>
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
    </Box>
  );
};
export default UpdateForm;
