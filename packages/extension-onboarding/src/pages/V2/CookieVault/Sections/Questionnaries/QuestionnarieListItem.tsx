import { Box, makeStyles } from "@material-ui/core";
import CallMadeIcon from "@material-ui/icons/CallMade";

import {
  EQuestionnaireStatus,
  Questionnaire,
  QuestionnaireWithAnswers,
} from "@snickerdoodlelabs/objects";
import { SDTypography, colors } from "@snickerdoodlelabs/shared-components";
import React from "react";
const useStyles = makeStyles((theme) => ({
  button: {
    cursor: "pointer",
    "&:hover $icon": {
      width: 18,
    },
    "&:hover $updateIcon": {
      opacity: 1,
    },
    "&:hover $updateBtn": {
      borderColor: colors.MAINPURPLE500,
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

interface IQuestionnarieListItemProps {
  questionnarie: Questionnaire | QuestionnaireWithAnswers;
  onClick: () => void;
}

const QuestionnarieListItem: React.FC<IQuestionnarieListItemProps> = ({
  onClick,
  questionnarie,
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
          src={questionnarie.image ?? ""}
          alt={questionnarie.title}
        />
        <Box>
          <SDTypography variant="titleMd" fontWeight="bold">
            {questionnarie.title}
          </SDTypography>
          <Box mt={0.5} />
          <SDTypography variant="titleSm">
            {questionnarie.description}
          </SDTypography>
        </Box>
      </Box>
      {questionnarie.status === EQuestionnaireStatus.Available ? (
        <Box
          height="fit-content"
          borderRadius={16}
          px={0.75}
          gridGap={8}
          display="flex"
          alignItems="center"
          py={0.5}
          bgcolor={colors.MINT50}
          color={colors.MINT500}
        >
          <img src="https://storage.googleapis.com/dw-assets/spa/icons-v2/cookie.svg" />
          <SDTypography color="inherit" variant="titleSm" fontWeight="bold">
            100
          </SDTypography>
          <CallMadeIcon color="inherit" className={classes.icon} />
        </Box>
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

export default QuestionnarieListItem;
