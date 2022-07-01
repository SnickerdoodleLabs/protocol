import React, { FC } from "react";
import { Button } from "@material-ui/core";
import { useStyles } from "@app/Popup/pages/Login/Login.style";
import { useAppContext } from "@app/Popup/context";

const Login: FC = () => {
  const classes = useStyles();
  const { coreGateway } = useAppContext();

  const handleLogin = () => {
    console.log("login trigger");
  };

  return <Button onClick={handleLogin}>Test</Button>;
};

export default Login;
