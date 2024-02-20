import { Box, makeStyles } from "@material-ui/core";
import { SDTypography } from "@shared-components/v2/components/Typograpy";
import { colors } from "@shared-components/v2/theme";
import clsx from "clsx";
import React, { useMemo, memo } from "react";
interface CheckboxProps {
  label?: string | number | React.ReactNode;
  checked: boolean | undefined;
  onChange?: () => void;
  size?: number;
  labelPosition?: "left" | "right" | "top" | "bottom";
}

const useStyles = makeStyles((theme) => ({
  checkbox: {
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
  checkboxIcon: {
    width: (props: { size: number }) => props.size,
    height: (props: { size: number }) => props.size,
    borderRadius: "4px",
    backgroundColor: colors.GREY50,
    border: `1px solid ${colors.GREY400}`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    "&:hover $hoverIcon": {
      opacity: 1,
    },
  },
  hoverIcon: {
    position: "absolute",
    fill: colors.MAINPURPLE500,
    opacity: 0,
    transition: "opacity 0.2s ease",
  },
  wrapperChecked: {
    border: `1px solid ${colors.MAINPURPLE500}`,
  },
  checkedIcon: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.MAINPURPLE500,
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
    size = 20,
  }) => {
    const classes = useStyles({ size });

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
        className={classes.checkbox}
        display="flex"
        width="fit-content"
        height="fit-content"
        alignItems="center"
        flexDirection={flexDirection}
        onClick={onChange}
      >
        <Box
          className={clsx(classes.checkboxIcon, {
            [classes.wrapperChecked]: checked,
          })}
        >
          {!checked && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="red"
              className={classes.hoverIcon}
              width="80%"
              height="80%"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
            </svg>
          )}
          <div
            className={clsx(classes.checkedIcon, {
              [classes.iconChecked]: checked,
            })}
          />
        </Box>
        {label != undefined ? (
          <Box {...{ [labelProp]: ["mt", "mb"].includes(labelProp) ? 2 : 1.5 }}>
            {typeof label === "string" ? (
              <SDTypography variant="bodyLg" hideOverflow fontWeight="bold">
                <span className={classes.label}>{label}</span>
              </SDTypography>
            ) : (
              label
            )}
          </Box>
        ) : null}
      </Box>
    );
  },
);
