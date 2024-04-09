import { Container as MuiContainer, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React, { FC, ReactNode } from "react";

interface IContainerProps {
  children: NonNullable<ReactNode>;
  fullHeight?: boolean;
}

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: "calc(100vh - 64px)",
    [theme.breakpoints.down("xs")]: {
      minHeight: "calc(100vh - 56px)",
    },
  },
  fullHeight: {
    minHeight: "100vh",
  },
}));

const Container: FC<IContainerProps> = ({ children, fullHeight }) => {
  const classes = useStyles();
  return (
    <MuiContainer
      className={clsx(classes.container, { [classes.fullHeight]: fullHeight })}
      maxWidth="lg"
    >
      {children}
    </MuiContainer>
  );
};

export default Container;
