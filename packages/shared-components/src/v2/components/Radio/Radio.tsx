import { Box, makeStyles } from "@material-ui/core";
import { SDTypography } from "@shared-components/v2/components/Typograpy";
import { colors } from "@shared-components/v2/theme";

import clsx from "clsx";
import React, { memo, useMemo } from "react";

interface RadioProps {
  label?: string | number | React.ReactNode;
  checked: boolean;
  onChange?: () => void;
  labelPosition?: "left" | "right" | "top" | "bottom";
  size?: number;
  disabled?: boolean;
}

const useStyles = makeStyles((theme) => ({
  radio: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  label: {
    webkitUserSelect: "none",
    userSelect: "none",
    mozUserSelect: "none",
    msUserSelect: "none",
  },
  outerCircle: {
    width: (props: { size: number; disabled?: boolean }) => props.size,
    height: (props: { size: number; disabled?: boolean }) => props.size,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "transform 0.2s ease",
    backgroundColor: colors.GREY50,
    border: `1px solid ${colors.GREY400}`,
  },
  innerCircle: {
    width: (props: { size: number; disabled?: boolean }) => props.size * 0.65,
    height: (props: { size: number; disabled?: boolean }) => props.size * 0.65,
    borderRadius: "50%",
    backgroundColor: (props: { size: number; disabled?: boolean }) =>
      props.disabled ? colors.GREY300 : colors.MAINPURPLE500,
    display: "block",
    transition: "transform 0.2s ease",
    transformOrigin: "center",
    transform: "scale(0)",
  },
  checkedInnerCircle: {
    transform: "scale(1)",
  },
  checkedOuterCircle: {
    border: `1px solid ${colors.MAINPURPLE500}`,
    backgroundColor: colors.WHITE,
  },
  left: {
    flexDirection: "row-reverse",
  },
  right: {
    flexDirection: "row",
  },
  top: {
    flexDirection: "column-reverse",
  },
  bottom: {
    flexDirection: "column",
  },
}));

export const SDRadio: React.FC<RadioProps> = memo(
  ({
    label,
    checked,
    onChange = () => {},
    labelPosition = "right",
    size = 20,
    disabled = false,
  }) => {
    const classes = useStyles({ size, disabled });

    const { labelProp, flexDirection } = useMemo(() => {
      switch (labelPosition) {
        case "left":
          return { flexDirection: "row-reverse", labelProp: "mr" };
        case "right":
          return { flexDirection: "row", labelProp: "ml" };
        case "top":
          return { flexDirection: "column-reverse", labelProp: "mb" };
        case "bottom":
        default:
          return { flexDirection: "column", labelProp: "mt" };
      }
    }, [labelPosition]);

    return (
      <Box
        className={clsx(classes.radio, {
          [classes.left]: labelPosition === "left",
          [classes.right]: labelPosition === "right",
          [classes.top]: labelPosition === "top",
          [classes.bottom]: labelPosition === "bottom",
        })}
        display="flex"
        width="fit-content"
        height="fit-content"
        alignItems="center"
        flexDirection={flexDirection}
        onClick={() => {
          !disabled && onChange();
        }}
      >
        <Box
          className={clsx(classes.outerCircle, {
            [classes.checkedOuterCircle]: !disabled && checked,
          })}
        >
          <div
            className={clsx(classes.innerCircle, {
              [classes.checkedInnerCircle]: checked,
            })}
          />
        </Box>
        {label != undefined ? (
          <Box {...{ [labelProp]: ["mt", "mb"].includes(labelProp) ? 2 : 1.5 }}>
            <SDTypography variant="bodyLg" hideOverflow fontWeight="bold">
              <span className={classes.label}>{label}</span>
            </SDTypography>
          </Box>
        ) : null}
      </Box>
    );
  },
);
