import {
  IMargin,
  ITextAlign,
  ITheme,
} from "@web-integration/implementations/app/ui/lib/interfaces/index.js";
import {
  marginStyles,
  textAlignStyles,
} from "@web-integration/implementations/app/ui/lib/styles/index.js";
import { defaultDarkTheme } from "@web-integration/implementations/app/ui/lib/theme/index.js";
import clsx from "clsx";
import React, { forwardRef, HTMLProps, Ref, useMemo } from "react";
import { createUseStyles, useTheme } from "react-jss";

const styleObject = {
  "sd-typography": {
    margin: 0,
    textAlign: "inherit",
    fontFamily: ({ theme }) => theme.typography.body.fontFamily,
    fontSize: ({ theme }) => theme.typography.body.fontSize,
    fontWeight: ({ theme }) => theme.typography.body.fontWeight,
    color: ({ theme }) => theme.palette.primaryText,
  },
  title: {
    fontFamily: ({ theme }) => theme.typography.title.fontFamily,
    fontSize: ({ theme }) => theme.typography.title.fontSize,
    fontWeight: ({ theme }) => theme.typography.title.fontWeight,
  },
  title2: {
    fontFamily: ({ theme }) => theme.typography.title2.fontFamily,
    fontSize: ({ theme }) => theme.typography.title2.fontSize,
    fontWeight: ({ theme }) => theme.typography.title2.fontWeight,
  },
  subtitle: {
    fontFamily: ({ theme }) => theme.typography.subtitle.fontFamily,
    fontSize: ({ theme }) => theme.typography.subtitle.fontSize,
    fontWeight: ({ theme }) => theme.typography.subtitle.fontWeight,
  },
  subtitle2: {
    fontFamily: ({ theme }) => theme.typography.subtitle2.fontFamily,
    fontSize: ({ theme }) => theme.typography.subtitle2.fontSize,
    fontWeight: ({ theme }) => theme.typography.subtitle2.fontWeight,
  },
  description: {
    fontFamily: ({ theme }) => theme.typography.description.fontFamily,
    fontSize: ({ theme }) => theme.typography.description.fontSize,
    fontWeight: ({ theme }) => theme.typography.description.fontWeight,
  },
  description2: {
    fontFamily: ({ theme }) => theme.typography.description2.fontFamily,
    fontSize: ({ theme }) => theme.typography.description2.fontSize,
    fontWeight: ({ theme }) => theme.typography.description2.fontWeight,
  },
  body: {
    fontFamily: ({ theme }) => theme.typography.body.fontFamily,
    fontSize: ({ theme }) => theme.typography.body.fontSize,
    fontWeight: ({ theme }) => theme.typography.body.fontWeight,
  },
  bodyBold: {
    fontFamily: ({ theme }) => theme.typography.bodyBold.fontFamily,
    fontSize: ({ theme }) => theme.typography.bodyBold.fontSize,
    fontWeight: ({ theme }) => theme.typography.bodyBold.fontWeight,
  },
  button: {
    fontFamily: ({ theme }) => theme.typography.button.fontFamily,
    fontSize: ({ theme }) => theme.typography.button.fontSize,
    fontWeight: ({ theme }) => theme.typography.button.fontWeight,
  },
  link: {
    fontFamily: ({ theme }) => theme.typography.link.fontFamily,
    fontSize: ({ theme }) => theme.typography.link.fontSize,
    fontWeight: ({ theme }) => theme.typography.link.fontWeight,
    cursor: "pointer",
  },
  ...textAlignStyles,
  ...marginStyles,
};

type classListType = keyof typeof styleObject;

const useStyles = createUseStyles<classListType, ITypographyProps, ITheme>(
  styleObject,
);

interface ITypographyProps
  extends HTMLProps<HTMLParagraphElement>,
    ITextAlign,
    IMargin {
  variant?: keyof ITheme["typography"];
}

export const Typography = forwardRef(
  (
    { className, children, variant = "body", ...rest }: ITypographyProps,
    ref: Ref<HTMLParagraphElement>,
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
        classes["sd-typography"],
        classes[variant],
        ...classList,
        className,
      ]);
    }, [rest, className, children, variant]);

    return (
      <p ref={ref} className={combinedClassNames} {...rest}>
        {children}
      </p>
    );
  },
);
