import { Box } from "@material-ui/core";
import React, { FC } from "react";

export const RootContainer: FC = ({ children }) => (
  <Box
    width="100%"
    height="100%"
    position="absolute"
    top="0"
    left="0"
    bgcolor="rgba(0,0,0,0.02)"
    zIndex="9999999999"
    display="flex"
  >
    {children}
  </Box>
);

export const ModalContainer: FC = ({ children }) => (
  <Box display="flex" margin="auto" width="60%" justifyContent="center">
    {children}
  </Box>
);

interface IModalContentContainerProps {
  leftComponent: React.JSX.Element | null;
  rightComponent: React.JSX.Element | null;
}
const ModalContentContainerSharedUIProps = {
  py: 8,
  px: 4,
  bgcolor: "background.default",
  display: "flex",
  flexDirection: "column",
};
export const ModalContentContainer: FC<IModalContentContainerProps> = ({
  leftComponent,
  rightComponent,
}) => {
  return (
    <>
      <Box
        {...ModalContentContainerSharedUIProps}
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        width="45%"
      >
        {leftComponent}
      </Box>
      {rightComponent && (
        <Box
          {...ModalContentContainerSharedUIProps}
          alignItems="flex-start"
          width={"55%"}
          textAlign="left"
        >
          {rightComponent}
        </Box>
      )}
    </>
  );
};
