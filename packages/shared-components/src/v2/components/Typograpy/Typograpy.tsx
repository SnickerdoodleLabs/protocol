import {
  Typography as MuiTypography,
  Theme,
  TypographyProps,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/styles";
import {
  typograpyVariants,
  fontWeights,
  genareteFontFamiles,
  generateDynamicTypographyColorClasses,
  ECustomTypographyVariant,
  EFontWeight,
  EFontFamily,
  ETypographyColorOverrides,
} from "@shared-components/v2/theme";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme: Theme) => {
  return {
    ...typograpyVariants,
    ...genareteFontFamiles(),
    ...fontWeights,
    ...generateDynamicTypographyColorClasses(theme),
  };
});

interface ITypographyProps extends Omit<TypographyProps, "variant" | "color"> {
  variant?: `${ECustomTypographyVariant}`;
  fontWeight?: `${EFontWeight}`;
  fontFamily?: `${EFontFamily}`;
  color?: `${ETypographyColorOverrides}`;
}

export const SDTypography = ({
  className,
  variant,
  fontWeight,
  fontFamily,
  color,
  ...rest
}: ITypographyProps) => {
  const classes = useStyles();
  return (
    <MuiTypography
      {...rest}
      className={clsx(
        variant && classes[variant],
        fontWeight && classes[fontWeight],
        fontFamily && classes[fontFamily],
        color && classes[color],
        className,
      )}
    />
  );
};
