import clsx from "clsx";
import React, {
  ReactNode,
  useMemo,
  ButtonHTMLAttributes,
  FC,
  ForwardedRef,
  forwardRef,
} from "react";
import { createUseStyles, useTheme } from "react-jss";

import { IMargin, ITheme } from "@core-iframe/app/ui/lib/interfaces";
import { marginStyles } from "@core-iframe/app/ui/lib/styles";
import { defaultDarkTheme } from "@core-iframe/app/ui/lib/theme";

const styleObject = {
  "sd-button": {
    overflow: "hidden",
    height: 40,
    borderRadius: 4,
    texAlign: "center",
    padding: "10px 20px",
    fontSize: ({ theme }) => theme.typography.button.fontSize,
    fontWeight: ({ theme }) => theme.typography.button.fontWeight,
    fontFamily: ({ theme }) => theme.typography.button.fontFamily,
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
    width: ({ fullWidth = false }) => (fullWidth ? "100%" : "fit-content"),
    "&:disabled": {
      cursor: "not-allowed",
    },
  },
  contained: {
    backgroundColor: ({ theme }) =>
      (theme as ITheme).palette.button ?? (theme as ITheme).palette.primary,
    color: ({ theme }) =>
      (theme as ITheme).palette.buttonContrast ??
      (theme as ITheme).palette.primaryContrast,
    "&:hover": {},
  },
  outlined: {
    backgroundColor: "transparent",
    color: ({ theme }) => (theme as ITheme).palette.primary,
    boxShadow: ({ theme }) =>
      `inset 0 0 0 1px ${(theme as ITheme).palette.primary}`,
    "&:hover": {},
  },
  text: {
    backgroundColor: "transparent",
    color: ({ theme }) => (theme as ITheme).palette.primary,
    "&:hover": {},
  },
  "sd-button-text": {
    fontWeight: "inherit",
    fontSize: "inherit",
    fontFamily: "inherit",
    color: "inherit",
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  ...marginStyles,
};

type classListType = keyof typeof styleObject;

const useStyles = createUseStyles<classListType, Partial<IButtonProps>, ITheme>(
  styleObject,
);

interface IButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    IMargin {
  disabled?: boolean;
  variant?: "contained" | "outlined" | "text";

  fullWidth?: boolean;
  children: ReactNode;
}

export const Button: FC<IButtonProps> = forwardRef(
  (
    { disabled, variant = "contained-primary", children, className, ...rest },
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    const theme = useTheme<ITheme>() || defaultDarkTheme;
    const classes = useStyles({ ...rest, theme });

    const combinedClassNames = useMemo(() => {
      const classList: string[] = [];
      Object.keys(rest).forEach((key) => {
        const item = classes[key];
        if (item) {
          classList.push(item);
        }
      });
      return clsx([
        classes["sd-button"],
        classes[variant],
        ...classList,
        className,
      ]);
    }, [rest]);

    return (
      <button
        ref={ref}
        className={combinedClassNames}
        disabled={disabled}
        {...rest}
      >
        <span className={classes["sd-button-text"]}>{children}</span>
      </button>
    );
  },
);
