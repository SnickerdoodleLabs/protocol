import { Box, makeStyles } from "@material-ui/core";
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
} from "@snickerdoodlelabs/shared-components";
import React from "react";
const useStyles = makeStyles((theme) => ({
  button: {
    cursor: "pointer",
    "&:hover $icon": {
      width: 18,
    },
    "&:hover $fillOutBtn": {
      opacity: 1,
    },
    "&:hover $updateBtn": {
      // borderColor: colors.MAINPURPLE500,
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
  updateIcon: {
    fontSize: 16,
    opacity: 0,
    transition: "opacity 1s ease",
  },
  updateBtn: {
    border: `1px solid transparent`,
    borderRadius: 2,
    transition: "border-color 0.3s ease",
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
  return (
    <Box
      className={classes.button}
      onClick={onClick}
      display="flex"
      justifyContent="space-between"
      p={1.5}
    >
      <Box display="flex" gridGap={24} alignItems="center">
        <img
          width={72}
          height={72}
          style={{
            borderRadius: 8,
          }}
          src={questionnaire.image ?? ""}
          alt={questionnaire.title}
        />
        <Box>
          <SDTypography variant="titleMd" fontWeight="bold">
            {questionnaire.title}
          </SDTypography>
          <Box mt={0.5} />
          <SDTypography variant="titleSm">
            {questionnaire.description}
          </SDTypography>
        </Box>
      </Box>
      {questionnaire.status === EQuestionnaireStatus.Available ? (
        <SDButton
          endIcon={<CallMadeIcon />}
          variant="outlined"
          className={classes.fillOutBtn}
        >
          Fill Out
        </SDButton>
      ) : (
        <Box
          display="flex"
          height="fit-content"
          px={0.75}
          py={0.5}
          className={classes.updateBtn}
        >
          <Box
            width={16}
            color={colors.MAINPURPLE500}
            height={16}
            position="relative"
          >
            <CallMadeIcon color="inherit" className={classes.updateIcon} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default QuestionnaireListItem;
