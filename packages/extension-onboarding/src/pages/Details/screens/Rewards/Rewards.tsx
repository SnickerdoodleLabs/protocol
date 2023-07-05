import { useAppContext } from "@extension-onboarding/context/App";
import { useStyles } from "@extension-onboarding/pages/Details/screens/Rewards/Rewards.style";
import React from "react";

export default () => {
  const classes = useStyles();
  const {} = useAppContext();
  return <p>Rewards</p>;
};
