import { TWITTER_URL } from "@extension-onboarding/constants";
import Box from "@material-ui/core/Box";
import {
  SDTypography,
  useResponsiveValue,
  colors,
} from "@snickerdoodlelabs/shared-components";
import React, { FC } from "react";

interface ISocialItemProps {
  icon: string;
  text: string;
  onClick: () => void;
}
const SocialItem: FC<ISocialItemProps> = ({ icon, text, onClick }) => {
  const getResponsiveValue = useResponsiveValue();
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <img
        src={icon}
        width={getResponsiveValue({ xs: 32, sm: 44 })}
        height={getResponsiveValue({ xs: 32, sm: 44 })}
      />
      <SDTypography
        mt={3}
        variant={getResponsiveValue({ xs: "bodyMd", md: "titleSm" })}
        align="center"
        hexColor={colors.DARKPURPLE500}
      >
        {text}
      </SDTypography>
    </Box>
  );
};

const SocialLinks = () => {
  const getResponsiveValue = useResponsiveValue();
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <SDTypography
        variant={getResponsiveValue({ xs: "titleLg", sm: "headlineMd" })}
        hexColor={colors.DARKPURPLE500}
        fontWeight="bold"
        align="center"
      >
        Stay in Touch
      </SDTypography>
      <Box
        mt={3}
        mb={20}
        display="flex"
        width="100%"
        bgcolor={colors.WHITE}
        border="1px solid"
        borderColor="borderColor"
        borderRadius={12}
        justifyContent="center"
        gridGap={{ xs: 16, sm: 76 }}
        py={{ xs: 4, sm: 5.5 }}
      >
        <SocialItem
          icon="https://storage.googleapis.com/dw-assets/spa/icons-v2/x-icon.svg"
          text="Follow on X"
          onClick={() => {
            window.open(TWITTER_URL, "_blank");
          }}
        />
        {/* <SocialItem
          icon="https://storage.googleapis.com/dw-assets/spa/icons-v2/telegram-icon.svg"
          text="Join Telegram"
          onClick={() => {}}
        /> */}
        <SocialItem
          icon="https://storage.googleapis.com/dw-assets/spa/icons-v2/call-icon.svg"
          text="Schedule a call"
          onClick={() => {
            window.open(
              "https://calendly.com/sdl-product-hours/30min",
              "_blank",
            );
          }}
        />
      </Box>
    </Box>
  );
};

export default SocialLinks;
