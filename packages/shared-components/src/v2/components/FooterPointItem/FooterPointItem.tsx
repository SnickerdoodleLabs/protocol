import { Box } from "@material-ui/core";
import { Image } from "@shared-components/v2/components/Image";
import { SDTypography } from "@shared-components/v2/components/Typograpy";
import { colors } from "@shared-components/v2/theme";
import React, { FC } from "react";

interface IFooterPointItem {
  icon: string;
  points: number;
  text?: string;
  totalPoints?: number;
  height?: number;
}
export const FooterPointItem: FC<IFooterPointItem> = ({
  icon,
  points,
  text,
  totalPoints,
  height = 40,
}) => {
  if (!points && !totalPoints) return null;
  return (
    <Box
      borderRadius="25px 30px 30px 25px"
      color={colors.MINT500}
      bgcolor={colors.MINT50}
      display="flex"
      width="fit-content"
      alignItems="center"
      height={height}
      pl={0.875}
      pr={2}
      mr={1}
    >
      <Image
        src={icon}
        width={26}
        height={26}
        errorImageSrc="https://storage.googleapis.com/dw-assets/spa/icons-v2/default-point.svg"
      />
      <SDTypography variant="titleSm" fontWeight="bold" ml={1} color="inherit">
        {text ? ` ${text} ` : ""}
        {points}
        {totalPoints ? `/${totalPoints}` : ""}
      </SDTypography>
    </Box>
  );
};
