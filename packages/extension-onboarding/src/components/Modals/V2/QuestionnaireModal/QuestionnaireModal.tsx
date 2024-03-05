import { useModalStyles } from "@extension-onboarding/components/Modals/Modal.style";
import Card from "@extension-onboarding/components/v2/Card";
import Image from "@extension-onboarding/components/v2/Image";
import QuestionnaireForm from "@extension-onboarding/components/v2/QuestionnaireForm";
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
  useResponsiveValue,
} from "@snickerdoodlelabs/shared-components";
import React, { FC } from "react";
export interface IQuestionnaireModal {
  questionnaire: Questionnaire;
  onSubmitClicked: (answers: NewQuestionnaireAnswer[]) => void;
}

const QuestionnaireModal: FC = () => {
  const { modalState, closeModal } = useLayoutContext();
  const { onPrimaryButtonClick, customProps } = modalState;
  const { questionnaire, onSubmitClicked } = customProps as IQuestionnaireModal;
  const modalClasses = useModalStyles();
  const getResponsiveValue = useResponsiveValue();

  return (
    <Dialog
      open={!!questionnaire}
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
            <Image
              width={getResponsiveValue({ xs: 32, sm: 72 })}
              height={getResponsiveValue({ xs: 32, sm: 72 })}
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
        <Divider />
        <Box mt={6} />
        <Box width="90%" margin="auto">
          <Card>
            <QuestionnaireForm
              onSubmit={(answers) => {
                onSubmitClicked(answers);
                closeModal();
              }}
              questionnaire={questionnaire}
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

export default QuestionnaireModal;
