import { EModalSelectors } from "@extension-onboarding/components/Modals";
import Card from "@extension-onboarding/components/v2/Card";
import CardTitle from "@extension-onboarding/components/v2/CardTitle";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import QuestionnaireListItem from "@extension-onboarding/pages/V2/CookieVault/Sections/Questionnaires/QuestionnaireListItem";
import { Box, Divider } from "@material-ui/core";
import {
  EQuestionnaireQuestionType,
  EQuestionnaireStatus,
  EQuestionnaireQuestionDisplayType,
  IpfsCID,
  MarketplaceTag,
  NewQuestionnaireAnswer,
  PagedResponse,
  Questionnaire,
  QuestionnaireAnswer,
  QuestionnaireQuestion,
  QuestionnaireWithAnswers,
  URLString,
  PagingRequest,
} from "@snickerdoodlelabs/objects";
import { useResponsiveValue } from "@snickerdoodlelabs/shared-components";
import { okAsync } from "neverthrow";
import React, { Fragment, memo, useEffect, useState } from "react";

const Questionnaries = () => {
  const { sdlDataWallet } = useDataWalletContext();
  const { setModal } = useLayoutContext();
  const [questionnaires, setQuestionnaires] =
    useState<(Questionnaire | QuestionnaireWithAnswers)[]>();

  useEffect(() => {
    getQuestionnaires();
  }, []);

  const getQuestionnaires = () => {
    sdlDataWallet.questionnaire
      .getAllQuestionnaires(new PagingRequest(1, 50))
      .map((res) => {
        setQuestionnaires(res.response);
      })
      .mapErr((err) => {
        console.log(err);
      });
  };

  const onQuestionnarieSubmit = (
    answers: NewQuestionnaireAnswer[],
    id: IpfsCID,
  ) => {
    sdlDataWallet.questionnaire.answerQuestionnaire(id, answers).map((res) => {
      getQuestionnaires();
    });
  };

  return (
    <>
      <Card>
        <CardTitle
          title="Questionnaries"
          subtitle="Questionnaries secure your personal information and preferences"
          titleVariant="headlineMd"
          subtitleVariant="bodyLg"
        />
        <Box
          mt={4}
          border="1px solid"
          borderRadius={16}
          borderColor="borderColor"
        >
          {questionnaires?.map((questionnaire, index) => {
            return (
              <Fragment key={`q-${questionnaire.id}`}>
                <QuestionnaireListItem
                  questionnaire={questionnaire}
                  onClick={() => {
                    const hasAnswers =
                      questionnaire instanceof QuestionnaireWithAnswers;
                    setModal({
                      modalSelector: hasAnswers
                        ? EModalSelectors.ANSWERED_QUESTIONNAIRE_MODAL
                        : EModalSelectors.QUESTIONNAIRE_MODAL,
                      onPrimaryButtonClick: () => {},
                      customProps: {
                        questionnaire,
                        onSubmitClicked: (
                          answers: NewQuestionnaireAnswer[],
                        ) => {
                          onQuestionnarieSubmit(answers, questionnaire.id);
                        },
                      },
                    });
                  }}
                />
                {index != questionnaires.length - 1 && <Divider />}
              </Fragment>
            );
          })}
        </Box>
      </Card>
    </>
  );
};

export default memo(Questionnaries);
