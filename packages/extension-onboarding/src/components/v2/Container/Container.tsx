import { Container as MuiContainer, makeStyles } from "@material-ui/core";
import React, { FC, ReactNode } from "react";

interface IContainerProps {
  children: NonNullable<ReactNode>;
}

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: "calc(100vh - 128px)",
    [theme.breakpoints.down("xs")]: {
      minHeight: "calc(100vh - 112px)",
    },
  },
}));

const Container: FC<IContainerProps> = ({ children }) => {
  const classes = useStyles();
  return (
    <MuiContainer className={classes.container} maxWidth="lg">
      {children}
    </MuiContainer>
  );
};

export default Container;
