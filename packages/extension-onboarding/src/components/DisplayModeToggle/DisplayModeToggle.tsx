import { Box } from "@material-ui/core";
import React, { FC } from "react";
import cozyIcon from "@extension-onboarding/assets/icons/cozy-toggle.png";
import compactIcon from "@extension-onboarding/assets/icons/compact-toggle.png";
import listIcon from "@extension-onboarding/assets/icons/list-toggle.png";
export enum EDISPLAY_MODE {
  COMPACT,
  COZY,
  LIST,
}

interface IDisplayModeToogleProps {
  selectedDisplayMode: EDISPLAY_MODE;
  setDisplayMode: (mode: EDISPLAY_MODE) => void;
}

const items = [
  { icon: cozyIcon, mode: EDISPLAY_MODE.COZY },
  { icon: compactIcon, mode: EDISPLAY_MODE.COMPACT },
  { icon: listIcon, mode: EDISPLAY_MODE.LIST },
];

const DisplayModeToggle: FC<IDisplayModeToogleProps> = ({
  selectedDisplayMode,
  setDisplayMode,
}) => {
  return (
    <Box
      px={0.75}
      bgcolor="rgba(22, 22, 26, 0.04)"
      py={0.25}
      display="flex"
      borderRadius={16}
      width="fit-content"
    >
      {items.map((item, index) => (
        <Box
          onClick={() => {
            setDisplayMode(item.mode);
          }}
          borderRadius={14}
          py={1}
          px={2.5}
          key={index}
          bgcolor={selectedDisplayMode === item.mode ? "#fff" : "transparent"}
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

export default DisplayModeToggle;
