import { Box, Theme, useTheme, makeStyles } from "@material-ui/core";
import React from "react";

interface ICloseButtonProps {
  size?: number;
  onClick?: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  cursor: {
    cursor: "pointer",
  },
}));

export const CloseButton: React.FC<ICloseButtonProps> = ({
  size = 24,
  onClick = () => {},
}) => {
  const theme = useTheme<Theme>();
  const classes = useStyles();
  return (
    <Box
      ml={3}
      width={size}
      height={size}
      onClick={onClick}
      className={classes.cursor}
    >
      <svg
        style={{ width: "inherit", height: "inherit" }}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
          fill={theme.palette.textBody}
        />
      </svg>
    </Box>
  );
};
