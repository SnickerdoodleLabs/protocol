import { Box } from "@material-ui/core";
import {
  CloseButton,
  SDTypography,
} from "@snickerdoodlelabs/shared-components";
import React, { FC } from "react";

interface IModalContentWrapperProps {
  children: React.ReactNode;
  title?: string;
  onCloseClick?: () => void;
}

export const ModalContentWrapper: FC<IModalContentWrapperProps> = ({
  children,
  onCloseClick,
  title,
}) => {
  return (
    <Box
      p={3}
      bgcolor="cardBgColor"
      maxHeight="90vh"
      minHeight="50vh"
      overflow="auto"
      position="relative"
      onClick={(e) => e.stopPropagation()}
    >
      <Box mb={2} display="flex" justifyContent="center">
        {title && (
          <SDTypography variant="titleMd" fontWeight="bold">
            {title}
          </SDTypography>
        )}
        <Box mr="auto" />
        <CloseButton onClick={onCloseClick} />
      </Box>
      {children}
    </Box>
  );
};
