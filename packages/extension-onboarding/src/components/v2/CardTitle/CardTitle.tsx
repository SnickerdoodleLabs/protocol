import Box from "@material-ui/core/Box";
import {
  ITypographyProps,
  SDTypography,
  colors,
  useResponsiveValue,
} from "@snickerdoodlelabs/shared-components";
import React, { FC, ReactNode } from "react";

interface ICardTitleProps {
  title:
    | ((comp: (title: string) => React.JSX.Element) => React.JSX.Element)
    | string;
  subtitle?: string;
}

const CardTitle: FC<ICardTitleProps> = ({ title, subtitle }) => {
  const getResponsiveValue = useResponsiveValue();
  return (
    <Box display="flex" width="100%" flexDirection="column">
      {typeof title === "function" ? (
        title((_title) => (
          <SDTypography
            variant={getResponsiveValue({ xs: "titleLg", sm: "headlineMd" })}
            fontWeight="bold"
            hexColor={colors.DARKPURPLE500}
          >
            {_title}
          </SDTypography>
        ))
      ) : (
        <SDTypography
          variant={getResponsiveValue({ xs: "titleLg", sm: "headlineMd" })}
          fontWeight="bold"
          hexColor={colors.DARKPURPLE500}
        >
          {title}
        </SDTypography>
      )}

      {subtitle && (
        <>
          <Box mt={1.5} />
          <SDTypography
            variant={getResponsiveValue({ xs: "bodyMd", sm: "bodyLg" })}
            fontWeight="regular"
            hexColor={colors.GREY600}
          >
            {subtitle}
          </SDTypography>
        </>
      )}
    </Box>
  );
};

export default CardTitle;
