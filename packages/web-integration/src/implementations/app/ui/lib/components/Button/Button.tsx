import { IMargin, ITheme } from "@web-integration/implementations/app/ui/lib/interfaces/index.js"
import { marginStyles } from "@web-integration/implementations/app/ui/lib/styles/index.js";
import { defaultDarkTheme } from "@web-integration/implementations/app/ui/lib/theme/index.js";
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

const styleObject = {
  "sd-button": {
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
  "contained-primary": {
    backgroundColor: ({ theme }) => theme.palette.primary,
    color: ({ theme }) => theme.palette.primaryContrast,
    "&:hover": {},
  },
  "contained-secondary": {
    backgroundColor: ({ theme }) => theme.palette.secondary,
    color: ({ theme }) => theme.palette.secondaryContrast,
    "&:hover": {},
  },
  "contained-gradient": {
    background: ({ theme }) => theme.palette.primaryGradient,
    color: ({ theme }) => theme.palette.gradientContrast,
    "&:hover": {},
  },
  "outlined-primary": {
    backgroundColor: "transparent",
    color: ({ theme }) => theme.palette.primary,
    boxShadow: ({ theme }) => `inset 0 0 0 1px ${theme.palette.primary}`,
    "&:hover": {},
  },
  "outlined-secondary": {
    backgroundColor: "transparent",
    color: ({ theme }) => theme.palette.secondary,
    boxShadow: ({ theme }) => `inset 0 0 0 1px ${theme.palette.secondary}`,
    "&:hover": {},
  },
  "sd-button-text": {
    fontWeight: "inherit",
    fontSize: "inherit",
    fontFamily: "inherit",
    color: "inherit",
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
  variant?:
    | "contained-primary"
    | "contained-secondary"
    | "contained-gradient"
    | "outlined-primary"
    | "outlined-secondary";
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
