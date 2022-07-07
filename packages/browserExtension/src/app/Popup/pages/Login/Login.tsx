import React, { FC } from "react";
import { Button } from "@material-ui/core";
import { useStyles } from "@app/Popup/pages/Login/Login.style";
import { useAppContext } from "@app/Popup/context";
import GoogleCard from "../GoogleCard/GoogleCard";

const Login: FC = () => {
  const classes = useStyles();
  const { coreGateway } = useAppContext();

  const handleLogin = () => {
    console.log("login trigger");
  };

  return <GoogleCard />;
};

export default Login;
