import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import {
  NewQuestionnaireAnswer,
  Questionnaire,
} from "@snickerdoodlelabs/objects";
import { FillQuestionnaireModal } from "@snickerdoodlelabs/shared-components";
import React, { FC } from "react";
export interface IQuestionnaireModal {
  questionnaire: Questionnaire;
  onSubmitClicked: (answers: NewQuestionnaireAnswer[]) => void;
}

const QuestionnaireModal: FC = () => {
  const { modalState, closeModal } = useLayoutContext();
  const { onPrimaryButtonClick, customProps } = modalState;
  const { questionnaire, onSubmitClicked } = customProps as IQuestionnaireModal;

  return (
    <FillQuestionnaireModal
      questionnaire={questionnaire}
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
