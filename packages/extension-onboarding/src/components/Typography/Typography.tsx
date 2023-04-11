import { useStyles } from "@extension-onboarding/components/Typography/Typography.style";
import {
  TypographyProps,
  Typography as MuiTypography,
} from "@material-ui/core";
import clsx from "clsx";
import React, { ElementType, FC } from "react";

type CustomVariants = "pageTitle" | "pageDescription";

interface ITypographyProps extends Omit<TypographyProps, "variant"> {
  variant?: TypographyProps["variant"] | CustomVariants;
  component?: ElementType;
}

const Typography: FC<ITypographyProps> = ({
  variant,
  className,
  children,
  ...restProps
}) => {
  const classes = useStyles();

  let isCustom = false;
  if (variant) {
    isCustom = Object.keys(classes).indexOf(variant) > -1;
  }

  return (
    <MuiTypography
      {...restProps}
      {...(variant &&
        !isCustom && {
          variant: variant as TypographyProps["variant"],
        })}
      className={clsx({
        ...(variant && isCustom && { [classes[variant]]: true }),
        ...(className && { [className]: true }),
      })}
    >
      {children}
    </MuiTypography>
  );
};

export default Typography;
