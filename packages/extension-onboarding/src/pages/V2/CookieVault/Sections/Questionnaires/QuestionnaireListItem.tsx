import { Box, Hidden, makeStyles } from "@material-ui/core";
import CallMadeIcon from "@material-ui/icons/CallMade";

import {
  EQuestionnaireStatus,
  Questionnaire,
  QuestionnaireWithAnswers,
} from "@snickerdoodlelabs/objects";
import {
  SDButton,
  SDTypography,
  colors,
  useResponsiveValue,
} from "@snickerdoodlelabs/shared-components";
import React, { useMemo } from "react";
const useStyles = makeStyles((theme) => ({
  button: {
    "&:hover $fillOutBtn": {
      opacity: 1,
    },
    "&:hover $updateBtn": {
      borderColor: colors.MAINPURPLE500,
    },
  },
  fillOutBtn: {
    opacity: 0,
    transition: "opacity 0.35s ease",
    [theme.breakpoints.down("xs")]: {
      opacity: 1,
    },
  },
  icon: {
    fontSize: 18,
    width: 0,
    transition: "width 0.35s ease",
  },
  updateIconBase: {
    opacity: 1,
    transition: "opacity 0.3s ease",
  },
  updateIconOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    fontSize: 18,
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  updateBtn: {
    border: `1px solid transparent`,
    transition: "border-color 0.3s ease",
    "&:hover $updateIconOverlay": {
      opacity: 1,
      [theme.breakpoints.down("xs")]: {
        opacity: 0,
      },
    },
    "&:hover $updateIconBase": {
      opacity: 0,
      [theme.breakpoints.down("xs")]: {
        opacity: 1,
      },
    },
    [theme.breakpoints.down("xs")]: {
      borderColor: colors.MAINPURPLE500,
    },
  },
}));

interface IQuestionnaireListItemProps {
  questionnaire: Questionnaire | QuestionnaireWithAnswers;
  onClick: () => void;
}

const QuestionnaireListItem: React.FC<IQuestionnaireListItemProps> = ({
  onClick,
  questionnaire,
}) => {
  const classes = useStyles();
  const getResponsiveValue = useResponsiveValue();

  const btn = useMemo(() => {
    if (questionnaire.status === EQuestionnaireStatus.Available) {
      return (
        <SDButton
          endIcon={<CallMadeIcon />}
          variant="outlined"
          className={classes.fillOutBtn}
        >
          Fill Out
        </SDButton>
      );
    }
    return (
      <SDButton variant="outlined" className={classes.updateBtn}>
        <Box position="relative" mx={2} width={19} height={18}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="18"
            viewBox="0 0 19 18"
            fill="none"
            className={classes.updateIconBase}
          >
            <g clip-path="url(#clip0_2655_2132)">
              <path
                d="M7.50638 6.89414L7.51013 6.89039M13.2424 15.69L12.6124 14.9925L12.6124 13.8L11.2624 13.8L11.2624 12.3L9.9199 12.3L8.9374 11.3175C8.7199 11.505 8.4799 11.6475 8.2174 11.76C7.8874 11.895 7.5424 11.9625 7.1899 11.9625C6.8374 11.9625 6.4924 11.895 6.1624 11.76C5.8324 11.625 5.5399 11.43 5.2924 11.175L3.3124 9.19498C3.0649 8.94748 2.8699 8.65498 2.7274 8.32498C2.5924 7.99498 2.5249 7.64998 2.5249 7.29748C2.5249 6.94498 2.5924 6.59998 2.7274 6.26998C2.8624 5.93998 3.0574 5.64748 3.3124 5.39998L6.0124 2.69998C6.2599 2.45248 6.5599 2.24998 6.8824 2.11498C7.2049 1.97998 7.5499 1.91248 7.9099 1.91248C8.2699 1.91248 8.6149 1.97998 8.9374 2.11498C9.2599 2.24998 9.5599 2.44498 9.8074 2.69998L11.7874 4.67998C12.0349 4.93498 12.2374 5.22748 12.3649 5.54998C12.4999 5.87998 12.5674 6.22498 12.5674 6.57748C12.5674 6.93748 12.4999 7.28248 12.3649 7.60498C12.2524 7.86748 12.1099 8.10748 11.9224 8.32498L16.2274 12.6825C16.3699 12.825 16.4449 13.0125 16.4449 13.215L16.4449 15.15C16.4449 15.5625 16.1074 15.9 15.6949 15.9L13.7749 15.9C13.5799 15.9 13.3849 15.825 13.2424 15.69Z"
                stroke="#6E62A6"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_2655_2132">
                <rect
                  width="18"
                  height="18"
                  fill="white"
                  transform="translate(0.5)"
                />
              </clipPath>
            </defs>
          </svg>
          <CallMadeIcon className={classes.updateIconOverlay} />
        </Box>
      </SDButton>
    );
  }, [questionnaire.status]);

  return (
    <Box
      className={classes.button}
      onClick={onClick}
      display="flex"
      justifyContent={"space-between"}
      alignItems={"space-between"}
      p={{ xs: 2, sm: 3 }}
    >
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        gridGap={{ xs: 16, sm: 24 }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        width={{ xs: "100%", sm: "fit-content" }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          width={{ xs: "100%", sm: "fit-content" }}
        >
          <img
            width={getResponsiveValue({ xs: 40, sm: 72 })}
            height={getResponsiveValue({ xs: 40, sm: 72 })}
            style={{
              borderRadius: 8,
            }}
            src={questionnaire.image ?? ""}
            alt={questionnaire.title}
          />
          <Hidden smUp>{btn}</Hidden>
        </Box>
        <Box>
          <SDTypography
            variant={getResponsiveValue({ xs: "titleSm", sm: "titleMd" })}
            fontWeight="bold"
          >
            {questionnaire.title}
          </SDTypography>
          <Box mt={0.5} />
          <SDTypography
            variant={getResponsiveValue({ xs: "bodyMd", sm: "titleSm" })}
          >
            {questionnaire.description}
          </SDTypography>
        </Box>
      </Box>
      <Hidden xsDown>{btn}</Hidden>
    </Box>
  );
};

export default QuestionnaireListItem;
