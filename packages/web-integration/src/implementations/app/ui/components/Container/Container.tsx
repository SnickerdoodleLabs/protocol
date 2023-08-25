import {
  Box,
  useTheme,
  ITheme,
  defaultDarkTheme,
} from "@web-integration/implementations/app/ui/lib/index.js";
import React, { FC } from "react";

export const RootContainer: FC = ({ children }) => (
  <Box
    width="100%"
    height="100%"
    position="absolute"
    top="0"
    left="0"
    bg="rgba(0,0,0,0.02)"
    zIndex="9999999999"
    display="flex"
  >
    {children}
  </Box>
);

export const ModalContainer: FC = ({ children }) => (
  <Box display="flex" m="auto" width="60%" justifyContent="center">
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
  display: "flex" as const,
  flexDirection: "column" as const,
};
export const ModalContentContainer: FC<IModalContentContainerProps> = ({
  leftComponent,
  rightComponent,
}) => {
  const theme = useTheme<ITheme>() || defaultDarkTheme;
  return (
    <>
      <Box
        {...ModalContentContainerSharedUIProps}
        justifyContent="center"
        bg={theme.palette.background}
        alignItems="center"
        textAlign="center"
        width="45%"
      >
        {leftComponent}
      </Box>
      {rightComponent && (
        <Box
          {...ModalContentContainerSharedUIProps}
          bg={theme.palette.background}
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
