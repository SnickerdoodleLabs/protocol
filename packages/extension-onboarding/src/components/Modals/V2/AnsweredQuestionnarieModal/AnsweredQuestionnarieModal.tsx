import { useModalStyles } from "@extension-onboarding/components/Modals/Modal.style";
import Card from "@extension-onboarding/components/v2/Card";
import { DeleteIcon } from "@extension-onboarding/components/v2/Icons";
import QuestionnarieForm from "@extension-onboarding/components/v2/QuestionnarieForm";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { Box, Dialog } from "@material-ui/core";
import {
  NewQuestionnaireAnswer,
  QuestionnaireWithAnswers,
} from "@snickerdoodlelabs/objects";
import {
  CloseButton,
  SDButton,
  SDTypography,
  colors,
} from "@snickerdoodlelabs/shared-components";
import React, { FC } from "react";
export interface IAnsweredQuestionnarieModal {
  questionnarie: QuestionnaireWithAnswers;
  onSubmitClicked: (answers: NewQuestionnaireAnswer[]) => void;
}

const AnsweredQuestionnarieModal: FC = () => {
  const { modalState, closeModal } = useLayoutContext();
  const { onPrimaryButtonClick, customProps } = modalState;
  const { questionnarie, onSubmitClicked } =
    customProps as IAnsweredQuestionnarieModal;
  const modalClasses = useModalStyles();

  return (
    <Dialog
      open={!!questionnarie}
      fullWidth
      onClose={closeModal}
      className={modalClasses.container}
      disablePortal
    >
      <Box
        p={3}
        bgcolor="background.default"
        display="flex"
        flexDirection="column"
      >
        <Box display="flex" justifyContent="space-between">
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
          <CloseButton onClick={closeModal} />
        </Box>
        <Box mt={6} />

        <QuestionnarieForm
          onSubmit={(answers) => {
            onSubmitClicked(answers);
            closeModal();
          }}
          questionnarie={questionnarie}
        />
        <Box color={colors.GREY500} display="flex">
          <SDButton startIcon={<DeleteIcon />} variant="text" color="inherit">
            Delete Survey
          </SDButton>
          <Box marginLeft="auto">
            <SDButton variant="outlined" type="submit" form="questionnarie">
              Update Answers
            </SDButton>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default AnsweredQuestionnarieModal;
