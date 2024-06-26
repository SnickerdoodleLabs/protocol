import MuiTypography, { TypographyProps } from "@material-ui/core/Typography";
import { styled, makeStyles, Theme } from "@material-ui/core/styles";
import { compose, spacing } from "@material-ui/system";
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

export interface ITypographyProps
  extends Omit<TypographyProps, "variant" | "color"> {
  variant?: `${ECustomTypographyVariant}`;
  fontWeight?: `${EFontWeight}`;
  fontFamily?: `${EFontFamily}`;
  color?: `${ETypographyColorOverrides}` | TypographyProps["color"];
  hideOverflow?: boolean;
  preWrap?: boolean;
  hexColor?: string;
}

export const SDTypography = styled(
  ({
    className,
    variant,
    fontWeight,
    fontFamily,
    color,
    hideOverflow,
    hexColor,
    style,
    ...rest
  }: ITypographyProps) => {
    const classes = useStyles();
    return (
      <MuiTypography
        {...rest}
        {...(!Object.values(ETypographyColorOverrides).includes(
          color as ETypographyColorOverrides,
        ) && { color: color as TypographyProps["color"] })}
        className={clsx(
          variant && classes[variant],
          fontWeight && classes[fontWeight],
          fontFamily && classes[fontFamily],
          color &&
            Object.values(ETypographyColorOverrides).includes(
              color as ETypographyColorOverrides,
            ) &&
            classes[color],
          className,
        )}
        {...(hexColor ? { style: { ...style, color: hexColor } } : { style })}
        component={typeof rest.children === "string" ? "p" : "span"}
      />
    );
  },
)(compose(spacing));
