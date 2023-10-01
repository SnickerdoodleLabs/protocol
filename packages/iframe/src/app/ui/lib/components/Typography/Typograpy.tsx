import clsx from "clsx";
import React, { forwardRef, HTMLProps, Ref, useMemo } from "react";
import { createUseStyles, useTheme } from "react-jss";

import {
  IMargin,
  ITextAlign,
  ITheme,
} from "@core-iframe/app/ui/lib/interfaces";
import {
  marginStyles,
  textAlignStyles,
} from "@core-iframe/app/ui/lib/styles";
import { defaultDarkTheme } from "@core-iframe/app/ui/lib/theme";


const styleObject = {
  "sd-typography": {
    margin: 0,
    textAlign: "inherit",
    fontFamily: ({ theme }) => (theme as ITheme).typography.body.fontFamily,
    fontSize: ({ theme }) => (theme as ITheme).typography.body.fontSize,
    fontWeight: ({ theme }) => (theme as ITheme).typography.body.fontWeight,
    color: ({ theme }) => (theme as ITheme).palette.text,
  },
  title: {
    fontFamily: ({ theme }) => (theme as ITheme).typography.title.fontFamily,
    fontSize: ({ theme }) => (theme as ITheme).typography.title.fontSize,
    fontWeight: ({ theme }) => (theme as ITheme).typography.title.fontWeight,
  },
  title2: {
    fontFamily: ({ theme }) => (theme as ITheme).typography.title2.fontFamily,
    fontSize: ({ theme }) => (theme as ITheme).typography.title2.fontSize,
    fontWeight: ({ theme }) => (theme as ITheme).typography.title2.fontWeight,
  },
  subtitle: {
    fontFamily: ({ theme }) => (theme as ITheme).typography.subtitle.fontFamily,
    fontSize: ({ theme }) => (theme as ITheme).typography.subtitle.fontSize,
    fontWeight: ({ theme }) => (theme as ITheme).typography.subtitle.fontWeight,
  },
  subtitle2: {
    fontFamily: ({ theme }) =>
      (theme as ITheme).typography.subtitle2.fontFamily,
    fontSize: ({ theme }) => (theme as ITheme).typography.subtitle2.fontSize,
    fontWeight: ({ theme }) =>
      (theme as ITheme).typography.subtitle2.fontWeight,
  },
  description: {
    fontFamily: ({ theme }) =>
      (theme as ITheme).typography.description.fontFamily,
    fontSize: ({ theme }) => (theme as ITheme).typography.description.fontSize,
    fontWeight: ({ theme }) =>
      (theme as ITheme).typography.description.fontWeight,
  },
  description2: {
    fontFamily: ({ theme }) =>
      (theme as ITheme).typography.description2.fontFamily,
    fontSize: ({ theme }) => (theme as ITheme).typography.description2.fontSize,
    fontWeight: ({ theme }) =>
      (theme as ITheme).typography.description2.fontWeight,
  },
  body: {
    fontFamily: ({ theme }) => (theme as ITheme).typography.body.fontFamily,
    fontSize: ({ theme }) => (theme as ITheme).typography.body.fontSize,
    fontWeight: ({ theme }) => (theme as ITheme).typography.body.fontWeight,
  },
  bodyBold: {
    fontFamily: ({ theme }) => (theme as ITheme).typography.bodyBold.fontFamily,
    fontSize: ({ theme }) => (theme as ITheme).typography.bodyBold.fontSize,
    fontWeight: ({ theme }) => (theme as ITheme).typography.bodyBold.fontWeight,
  },
  button: {
    fontFamily: ({ theme }) => (theme as ITheme).typography.button.fontFamily,
    fontSize: ({ theme }) => (theme as ITheme).typography.button.fontSize,
    fontWeight: ({ theme }) => (theme as ITheme).typography.button.fontWeight,
  },
  link: {
    fontFamily: ({ theme }) => (theme as ITheme).typography.link.fontFamily,
    fontSize: ({ theme }) => (theme as ITheme).typography.link.fontSize,
    fontWeight: ({ theme }) => (theme as ITheme).typography.link.fontWeight,
    color: ({ theme }) => (theme as ITheme).palette.linkText,
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
