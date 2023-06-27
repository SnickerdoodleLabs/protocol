import React, { FC } from "react";
import { Box } from "@material-ui/core";

interface IBackButtonProps {
  onClick: () => void;
}

const BackButton: FC<IBackButtonProps> = ({ onClick }) => {
  return (
    <Box
      onClick={onClick}
      style={{ cursor: "pointer" }}
      alignItems="center"
      justifyContent="center"
      width={36}
      height={36}
      borderRadius="50%"
      boxShadow="0px 4px 4px rgba(0, 0, 0, 0.1)"
      bgcolor="#fff"
      display="flex"
    >
      <img
        width={13.4}
        height={12.71}
        src="https://storage.googleapis.com/dw-assets/spa/icons/back.png"
      />
    </Box>
  );
};

export default BackButton;
