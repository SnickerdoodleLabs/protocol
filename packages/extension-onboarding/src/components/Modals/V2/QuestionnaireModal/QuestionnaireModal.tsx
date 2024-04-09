import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import {
  NewQuestionnaireAnswer,
  Questionnaire,
} from "@snickerdoodlelabs/objects";
import { FillQuestionnaireModal } from "@snickerdoodlelabs/shared-components";
import React, { FC, ReactNode } from "react";
export interface IQuestionnaireModal {
  questionnaire: Questionnaire;
  onSubmitClicked: (answers: NewQuestionnaireAnswer[]) => void;
  maxWidth?: number;
}

const QuestionnaireModal: FC = () => {
  const { modalState, closeModal } = useLayoutContext();
  const { onPrimaryButtonClick, customProps } = modalState;
  const { questionnaire, onSubmitClicked, maxWidth } =
    customProps as IQuestionnaireModal;

  return (
    <FillQuestionnaireModal
      questionnaire={questionnaire}
      maxWidth={maxWidth}
      onQuestionnaireSubmit={(answers) => {
        onSubmitClicked(answers);
        closeModal();
      }}
      open={!!questionnaire}
      onClose={closeModal}
    />
  );
};

export default QuestionnaireModal;
