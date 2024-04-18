import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import clsx from "clsx";
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
  },
  disableOverflow: {
    overflowY: "auto",
  },
}));

interface IModalContainerProps {
  onOutsideClick?: () => void;
  allowOverflow?: boolean;
}

export const ModalContainer: FC<IModalContainerProps> = ({
  children,
  onOutsideClick,
  allowOverflow,
}) => {
  const classes = useStyles();
  return (
    <Box
      display="flex"
      {...(onOutsideClick && { onClick: onOutsideClick })}
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
      <Container
        maxWidth="lg"
        className={clsx(
          classes.modalContentWrapper,
          !allowOverflow && classes.disableOverflow,
        )}
      >
        {children}
      </Container>
    </Box>
  );
};
