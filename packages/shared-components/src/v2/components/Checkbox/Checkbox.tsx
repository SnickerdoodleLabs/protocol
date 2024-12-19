import Box from "@material-ui/core/Box";
import { darken, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React, { useMemo, memo } from "react";

import { SDTypography } from "@shared-components/v2/components/Typograpy";
import { colors } from "@shared-components/v2/theme";

interface CheckboxProps {
  label?: string | number | React.ReactNode;
  align?: "center" | "flex-start" | "flex-end" | "baseline" | "stretch";
  checked: boolean | undefined;
  onChange?: () => void;
  size?: number;
  labelPosition?: "left" | "right" | "top" | "bottom";
  color?: string;
  variant?: "default" | "outlined";
}

interface StyleProps {
  size: number;
  color?: string;
  variant: "default" | "outlined";
}

const useStyles = makeStyles((theme) => ({
  checkbox: (props: StyleProps) => ({
    display: "flex",
    cursor: "pointer",
    ...(props.variant === "outlined" && {
      border: `1px solid ${theme.palette.borderColor}`,
      borderRadius: "4px",
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1.5),
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5),
    }),
  }),
  outlinedChecked: {
    backgroundColor: (props: StyleProps) =>
      props.color ?? theme.palette.primary.main,
    borderColor: (props: StyleProps) =>
      `${props.color ?? theme.palette.primary.main} !important`,
  },
  label: {
    webkitUserSelect: "none",
    userSelect: "none",
    mozUserSelect: "none",
    msUserSelect: "none",
  },
  checkboxIcon: {
    width: (props: StyleProps) => props.size,
    height: (props: StyleProps) => props.size,
    minWidth: (props: StyleProps) => props.size,
    minHeight: (props: StyleProps) => props.size,
    borderRadius: "4px",
    backgroundColor: darken(theme.palette.cardBgColor, 0.0175),
    border: `1px solid ${darken(theme.palette.borderColor, 0.155)}`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    "&:hover $hidden": {
      opacity: 1,
    },
  },
  visible: {
    opacity: 1,
  },
  hidden: {
    opacity: 0,
  },
  hoverIcon: {
    position: "absolute",
    fill: (props: StyleProps) => props.color ?? theme.palette.primary.main,
    transition: "opacity 0.2s ease",
  },
  wrapperChecked: {
    border: (props: StyleProps) =>
      `1px solid ${props.color ?? theme.palette.primary.main}`,
  },
  checkedIcon: {
    width: "100%",
    height: "100%",
    backgroundColor: (props: StyleProps) =>
      props.color ?? theme.palette.primary.main,
    backgroundImage:
      "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23fff%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpath d=%22M20 6L9 17l-5-5%22/%3E%3C/svg%3E')",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "80%",
    opacity: 0,
    transform: "scale(0.5)",
    transition: "transform 0.1s ease",
  },
  iconChecked: {
    opacity: 1,
    transform: "scale(1)",
  },
}));

export const SDCheckbox: React.FC<CheckboxProps> = memo(
  ({
    label,
    checked,
    onChange = () => {},
    labelPosition = "right",
    align = "center",
    size = 20,
    color,
    variant = "default",
  }) => {
    const classes = useStyles({ size, color, variant });

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
        className={clsx(classes.checkbox, {
          [classes.outlinedChecked]: checked && variant === "outlined",
        })}
        display="flex"
        width="fit-content"
        height="fit-content"
        alignItems={align}
        flexDirection={flexDirection}
        onClick={onChange}
      >
        <Box
          className={clsx(classes.checkboxIcon, {
            [classes.wrapperChecked]: checked,
          })}
        >
          {(!checked || (checked && variant === "outlined")) && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={clsx(classes.hoverIcon, {
                [classes.hidden]: !checked,
                [classes.visible]: checked && variant === "outlined",
              })}
              width="80%"
              height="80%"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
            </svg>
          )}
          {variant !== "outlined" && (
            <div
              className={clsx(classes.checkedIcon, {
                [classes.iconChecked]: checked,
              })}
            />
          )}
        </Box>
        {label != null ? (
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
