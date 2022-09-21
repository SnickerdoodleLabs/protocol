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

const useProfileIFormLogic = (): {
  isGoogleButtonVisible: boolean;
  onGoogleLoginSuccess: (res: any) => void;
  onGoogleLoginFail: (res: any) => void;
  formValues: PII;
  schema: yup.ObjectSchema<any>;
  isSubmitted: boolean;
  onFormSubmit: (values: PII) => Promise<any>;
} => {
  const { apiGateway, dataWalletGateway } = useAppContext();
  const { setAlert } = useNotificationContext();
  const [isGoogleButtonVisible, setGoogleButtonVisible] = useState(true);
  const [formValues, setFormValues] = useState<PII>(new PII());
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

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

  const onGoogleLoginSuccess = (res) => {
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
  const onGoogleLoginFail = (res) => {
    console.log("googleResFail", res);
  };

  const onFormSubmit = async (values: PII) => {
    await sendDataToWallet(values);
    setIsSubmitted(true);
  };

  return {
    isGoogleButtonVisible,

    onGoogleLoginSuccess,
    onGoogleLoginFail,
    formValues,
    schema,
    isSubmitted,
    onFormSubmit,
  };
};

export default useProfileIFormLogic;
