import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import CallMade from "@material-ui/icons/CallMade";
import {
  colors,
  shadows,
  useResponsiveValue,
  Image,
  SDTypography,
  ECustomTypographyVariant,
} from "@snickerdoodlelabs/shared-components";
import clsx from "clsx";
import React from "react";

interface IRenderOfferItemProps {
  name: string;
  icon: string;
  description: string;
  brandImage: string;
  points: number;
  onClick: () => void;
  padding?: number;
  disabled?: boolean;
  mt?: number;
  mb?: number;
  nameFontVariant?: `${ECustomTypographyVariant}`;
  descriptionFontVariant?: `${ECustomTypographyVariant}`;
}

const Renderer: React.FC<IRenderOfferItemProps> = ({
  name,
  icon,
  description,
  onClick,
  brandImage,
  points,
  mt = 1.5,
  mb = 0,
  padding = 3,
  disabled,
  nameFontVariant = "titleMd",
  descriptionFontVariant = "bodyMd",
}) => {
  const classes = useStyles();
  const getResponsiveValue = useResponsiveValue();

  return (
    <Box
      className={clsx(classes.root, { [classes.rootDisabled]: disabled })}
      mt={mt}
      mb={mb}
      bgcolor={colors.WHITE}
      alignItems="center"
      border="1px solid"
      borderColor="borderColor"
      borderRadius={12}
      overflow="hidden"
      display="flex"
      p={padding}
      onClick={() => {
        !disabled && onClick();
      }}
    >
      <Image
        src={icon}
        width={getResponsiveValue({ xs: 40, sm: 84 })}
        height={getResponsiveValue({ xs: 40, sm: 84 })}
      />
      <Box
        flex={1}
        ml={3}
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Box
          pr={3}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <SDTypography
            variant={nameFontVariant}
            fontWeight="bold"
            hexColor={colors.DARKPURPLE500}
          >
            {name}
          </SDTypography>
          {points > 0 && (
            <Box
              height={40}
              color={colors.MINT500}
              borderRadius={25}
              border={`1px solid ${colors.MINT500}`}
              pl={1}
              pr={2}
              display="flex"
              width="fit-content"
              alignItems="center"
            >
              <Image
                src={brandImage}
                style={{ borderRadius: 13 }}
                errorImageSrc="https://storage.googleapis.com/dw-assets/spa/icons-v2/default-point.svg"
                width={26}
                height={26}
              />
              <SDTypography
                color="inherit"
                ml={0.75}
                mr={0.25}
                variant="titleSm"
                fontWeight="bold"
              >
                Earn{` ${points}`}
              </SDTypography>
              <CallMade style={{ width: 16, height: 16 }} color="inherit" />
            </Box>
          )}
        </Box>
        <SDTypography
          mt={1.5}
          variant={descriptionFontVariant}
          fontWeight="medium"
          hexColor={colors.GREY600}
        >
          {description}
        </SDTypography>
      </Box>
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    "&:hover": {
      cursor: "pointer",
      boxShadow: shadows.lg,
    },
  },
  rootDisabled: {
    blur: "blur(2px)",
    "&:hover": {
      cursor: "not-allowed",
    },
  },
}));

export default Renderer;
