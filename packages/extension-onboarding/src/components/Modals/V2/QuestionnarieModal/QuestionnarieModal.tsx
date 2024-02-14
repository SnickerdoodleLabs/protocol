import { useModalStyles } from "@extension-onboarding/components/Modals/Modal.style";
import Card from "@extension-onboarding/components/v2/Card";
import QuestionnarieForm from "@extension-onboarding/components/v2/QuestionnarieForm";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { Box, Dialog, Divider, Grid } from "@material-ui/core";
import {
  NewQuestionnaireAnswer,
  Questionnaire,
} from "@snickerdoodlelabs/objects";
import {
  CloseButton,
  SDButton,
  SDTypography,
  colors,
} from "@snickerdoodlelabs/shared-components";
import React, { FC } from "react";
export interface IQuestionnarieModal {
  questionnarie: Questionnaire;
  onSubmitClicked: (answers: NewQuestionnaireAnswer[]) => void;
}

const QuestionnarieModal: FC = () => {
  const { modalState, closeModal } = useLayoutContext();
  const { onPrimaryButtonClick, customProps } = modalState;
  const { questionnarie, onSubmitClicked } = customProps as IQuestionnarieModal;
  const modalClasses = useModalStyles();

  return (
    <Dialog
      open={!!questionnarie}
      fullWidth
      onClose={closeModal}
      className={modalClasses.containerLg}
      disablePortal
    >
      <Box bgcolor="background.default" display="flex" flexDirection="column">
        <Box
          p={3}
          bgcolor={colors.WHITE}
          display="flex"
          justifyContent="space-between"
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
          <CloseButton onClick={closeModal} />
        </Box>
        <Divider />
        <Box mt={6} />
        <Box width="90%" margin="auto">
          <Card>
            <QuestionnarieForm
              onSubmit={(answers) => {
                onSubmitClicked(answers);
                closeModal();
              }}
              questionnarie={questionnarie}
              renderItem={(text, input, isLast) => (
                <>
                  <Box py={4}>
                    {text}
                    <Box mt={2.5} />
                    {input}
                  </Box>
                  {!isLast && <Divider />}
                </>
              )}
            />
          </Card>
        </Box>
        <Divider />
        <Box display="flex" py={1.5} px={2.75} bgcolor={colors.WHITE}>
          <Box marginLeft="auto">
            <SDButton type="submit" form="questionnarie">
              Save to Vault
            </SDButton>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default QuestionnarieModal;
