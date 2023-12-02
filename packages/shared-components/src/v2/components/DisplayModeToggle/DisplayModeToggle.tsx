import { Box } from "@material-ui/core";
import React, { FC } from "react";

export enum EToggleDisplayMode {
  COMPACT,
  COZY,
}

interface IDisplayModeToggleProps {
  selectedDisplayMode: EToggleDisplayMode;
  setDisplayMode: (mode: EToggleDisplayMode) => void;
}

const items = [
  { icon: "https://storage.googleapis.com/dw-assets/shared/icons/cozy-toggle.png", mode: EToggleDisplayMode.COZY },
  { icon: "https://storage.googleapis.com/dw-assets/shared/icons/compact-toggle.png", mode: EToggleDisplayMode.COMPACT },
];

export const DisplayModeToggleButtons: FC<IDisplayModeToggleProps> = ({
  selectedDisplayMode,
  setDisplayMode,
}) => {
  return (
    <Box
      px={0.75}
      bgcolor="borderColor"
      py={0.25}
      display="flex"
      borderRadius={16}
      width="fit-content"
      height="fit-content"
    >
      {items.map((item, index) => (
        <Box
          onClick={() => {
            setDisplayMode(item.mode);
          }}
          borderRadius={14}
          py={1}
          px={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
          key={index}
          bgcolor={selectedDisplayMode === item.mode ? "cardBgColor" : "transparent"}
        >
          <img
            style={{
              opacity: selectedDisplayMode === item.mode ? 1 : 0.5,
            }}
            src={item.icon}
          />
        </Box>
      ))}
    </Box>
  );
};

