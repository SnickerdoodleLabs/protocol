import { useModalStyles } from "@extension-onboarding/components/Modals/Modal.style";
import { DeleteIcon } from "@extension-onboarding/components/v2/Icons";
import QuestionnaireForm from "@extension-onboarding/components/v2/QuestionnaireForm";
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
export interface IAnsweredQuestionnaireModal {
  questionnaire: QuestionnaireWithAnswers;
  onSubmitClicked: (answers: NewQuestionnaireAnswer[]) => void;
}

const AnsweredQuestionnarieModal: FC = () => {
  const { modalState, closeModal } = useLayoutContext();
  const [isDirty, setIsDirty] = React.useState(false);
  const { onPrimaryButtonClick, customProps } = modalState;
  const { questionnaire, onSubmitClicked } =
    customProps as IAnsweredQuestionnaireModal;
  const modalClasses = useModalStyles();

  return (
    <Dialog
      open={!!questionnaire}
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
          <CloseButton onClick={closeModal} />
        </Box>
        <Box mt={6} />

        <QuestionnaireForm
          onDirtyStateChange={setIsDirty}
          onSubmit={(answers) => {
            onSubmitClicked(answers);
            closeModal();
          }}
          questionnaire={questionnaire}
        />
        <Box color={colors.GREY500} display="flex">
          <SDButton startIcon={<DeleteIcon />} variant="text" color="inherit">
            Delete Survey
          </SDButton>
          <Box marginLeft="auto">
            <SDButton
              disabled={!isDirty}
              variant="outlined"
              type="submit"
              form="questionnarie"
            >
              Update Answers
            </SDButton>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default AnsweredQuestionnarieModal;
