import { Box, Container, makeStyles } from "@material-ui/core";
import React, { FC } from "react";

interface IModalContainerProps {
  children: NonNullable<React.ReactNode>;
}

const useStyles = makeStyles((theme) => ({
  modalContainer: {
    overflowY: "auto",
  },
  modalContentWrapper: {
    margin: "auto",
    maxHeight: "98%",
    overflowY: "auto",
  },
}));

export const ModalContainer: FC<IModalContainerProps> = ({ children }) => {
  const classes = useStyles();
  return (
    <Box
      display="flex"
      position="fixed"
      overflow="auto"
      top={0}
      left={0}
      width="100%"
      height="100%"
      maxWidth="100%"
      className={classes.modalContainer}
      bgcolor="rgba(0, 0, 0, 0.1)"
      zIndex={2000}
    >
      <Container maxWidth="lg" className={classes.modalContentWrapper}>
        {children}
      </Container>
    </Box>
  );
};
