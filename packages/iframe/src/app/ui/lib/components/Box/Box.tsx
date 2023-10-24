import clsx from "clsx";
import React, { forwardRef, HTMLAttributes, Ref, useMemo } from "react";
import { createUseStyles, useTheme } from "react-jss";

import {
  IBackground,
  IBorder,
  ICenter,
  IComponentDefaultProps,
  IDisplay,
  IFlex,
  IMargin,
  IOverflow,
  IPadding,
  IPosition,
  ISize,
  ITextAlign,
  ITheme,
  IZIndex,
  IPointer,
} from "@core-iframe/app/ui/lib/interfaces";
import {
  backgroundStyles,
  borderStyles,
  center,
  displayStyles,
  flexStyles,
  marginStyles,
  overflowStyles,
  paddingStyles,
  positionStyles,
  sizeStyles,
  textAlignStyles,
  zIndexStyles,
  pointer,
} from "@core-iframe/app/ui/lib/styles";
import { defaultDarkTheme } from "@core-iframe/app/ui/lib/theme";

interface IBoxProps
  extends IComponentDefaultProps,
    HTMLAttributes<HTMLDivElement>,
    IMargin,
    IPadding,
    IFlex,
    IDisplay,
    IBackground,
    ICenter,
    IBorder,
    ISize,
    ITextAlign,
    IOverflow,
    IPosition,
    IZIndex,
    IPointer {}

const styleObject = {
  root: {
    display: "inline-table",
  },
  ...paddingStyles,
  ...marginStyles,
  ...displayStyles,
  ...flexStyles,
  ...backgroundStyles,
  ...center,
  ...pointer,
  ...borderStyles,
  ...sizeStyles,
  ...textAlignStyles,
  ...positionStyles,
  ...zIndexStyles,
  ...overflowStyles,
};

type classListType = keyof typeof styleObject;

const useStyles = createUseStyles<classListType, IBoxProps, ITheme>(
  styleObject,
);

export const Box = forwardRef(
  (
    { key, children, className, ...rest }: IBoxProps,
    ref: Ref<HTMLDivElement>,
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
      return clsx([classes.root, ...classList, className]);
    }, [classes, className, rest]);

    return (
      <div key={key} ref={ref} className={combinedClassNames} {...rest}>
        {children}
      </div>
    );
  },
);
