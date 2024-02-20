import { EModalSelectors } from "@extension-onboarding/components/Modals";
import Card from "@extension-onboarding/components/v2/Card";
import CardTitle from "@extension-onboarding/components/v2/CardTitle";
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
} from "@snickerdoodlelabs/objects";
import { useResponsiveValue } from "@snickerdoodlelabs/shared-components";
import { okAsync } from "neverthrow";
import React, { Fragment, memo, useEffect, useState } from "react";

const mockQuestionnaires: PagedResponse<Questionnaire> =
  new PagedResponse<Questionnaire>(
    [
      new Questionnaire(
        IpfsCID("123"),
        MarketplaceTag("test"),
        EQuestionnaireStatus.Available,
        "Unanswered Questionnarie Sample",
        "This is a test questionnaire",
        URLString("https://picsum.photos/id/63/70/70"),
        [
          new QuestionnaireQuestion(
            0,
            EQuestionnaireQuestionType.Text,
            "What is your name?",
            null,
            5,
            null,
            null,
            false,
            true,
          ),
          new QuestionnaireQuestion(
            1,
            EQuestionnaireQuestionType.Numeric,
            "Numeric field?",
            null,
            2,
            10,
            null,
            false,
            true,
          ),
          new QuestionnaireQuestion(
            2,
            EQuestionnaireQuestionType.MultipleChoice,
            "What is your age group?",
            ["10-17", "18-24", "25-40", "41-54", "55-70", "70+"],
            1,
            2,
            EQuestionnaireQuestionDisplayType.List,
            true,
            true,
          ),
          new QuestionnaireQuestion(
            3,
            EQuestionnaireQuestionType.MultipleChoice,
            "How often do you go to the gym in a week?",
            ["1-2", "3-4", "5-6", "7-8"],
            null,
            null,
            EQuestionnaireQuestionDisplayType.Scale,
            false,
            true,
          ),
          new QuestionnaireQuestion(
            10,
            EQuestionnaireQuestionType.MultipleChoice,
            "How often do you go to the gym in a week?",
            [1, 2, 3, 4, 5],
            null,
            null,
            EQuestionnaireQuestionDisplayType.List,
            false,
            true,
            "lower",
            "upper",
          ),
          new QuestionnaireQuestion(
            6,
            EQuestionnaireQuestionType.MultipleChoice,
            "How often do you go to the gym in a week?",
            [1, 2, 3, 4, 5],
            null,
            null,
            EQuestionnaireQuestionDisplayType.Scale,
            false,
            true,
            "lower",
            "upper",
          ),
          new QuestionnaireQuestion(
            4,
            EQuestionnaireQuestionType.MultipleChoice,
            "multiple choice with min and max selection",
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
            2,
            5,
            null,
            true,
            true,
          ),
          new QuestionnaireQuestion(
            5,
            EQuestionnaireQuestionType.Location,
            "What was the last country you visited?",
            null,
            null,
            null,
            null,
            false,
            false,
          ),
          new QuestionnaireQuestion(
            6,
            EQuestionnaireQuestionType.Location,
            "List 3 countries you visited?",
            null,
            3,
            3,
            null,
            true,
            true,
          ),
        ],
      ),
    ],
    1,
    20,
    40,
  );

const questionnaireWithAnswersMock: QuestionnaireWithAnswers =
  new QuestionnaireWithAnswers(
    IpfsCID("1235"),
    MarketplaceTag("test"),
    EQuestionnaireStatus.Complete,
    "Answered Questionnarie Sample",
    "This is a test questionnaire with answers",
    URLString("https://picsum.photos/id/250/70/70"),
    [
      new QuestionnaireQuestion(
        0,
        EQuestionnaireQuestionType.Text,
        "What is your name?",
        null,
        null,
        null,
        null,
        false,
        true,
      ),
      new QuestionnaireQuestion(
        1,
        EQuestionnaireQuestionType.MultipleChoice,
        "What is your age group?",
        ["1-2", "3-4", "5-6", "7-8"],
        null,
        null,
        null,
        false,
        true,
      ),
      new QuestionnaireQuestion(
        3,
        EQuestionnaireQuestionType.MultipleChoice,
        "How often do you go to the gym in a week??",
        ["1-2", "3-4", "5-6", "7-8"],
        null,
        null,
        null,
        false,
        true,
      ),
      new QuestionnaireQuestion(
        2,
        EQuestionnaireQuestionType.Location,
        "What was the last country you visited?",
        null,
        null,
        null,
        null,
        false,
        false,
      ),
      new QuestionnaireQuestion(
        6,
        EQuestionnaireQuestionType.MultipleChoice,
        "How often do you go to the gym in a week?",
        [1, 2, 3, 4, 5],
        null,
        null,
        EQuestionnaireQuestionDisplayType.Scale,
        false,
        true,
        "lower",
        "upper",
      ),
    ],
    [
      new QuestionnaireAnswer(IpfsCID("123"), 3, "3-4"),
      new QuestionnaireAnswer(IpfsCID("123"), 0, "John Doe"),
      new QuestionnaireAnswer(IpfsCID("123"), 1, "7-8"),
      new QuestionnaireAnswer(IpfsCID("123"), 6, 2),
      new QuestionnaireAnswer(IpfsCID("123"), 2, "TR"),
    ],
    undefined as any,
  );

const answeredQuestionnariesMocks = new PagedResponse<QuestionnaireWithAnswers>(
  [questionnaireWithAnswersMock],
  1,
  20,
  40,
);

const Questionnaries = () => {
  const [unAnsweredQuestionnaires, setUnAnsweredQuestionnaires] =
    React.useState<PagedResponse<Questionnaire>>();

  const [answeredQuestionnaires, setAnsweredQuestionnaires] =
    React.useState<PagedResponse<QuestionnaireWithAnswers>>();
  const { setModal } = useLayoutContext();

  useEffect(() => {
    getUnAnsweredQuestionnaires();
    getAnsweredQuestionnaries();
  }, []);

  const getUnAnsweredQuestionnaires = () => {
    okAsync(mockQuestionnaires).map((response) => {
      setUnAnsweredQuestionnaires(response);
    });
  };

  const getAnsweredQuestionnaries = () => {
    okAsync(answeredQuestionnariesMocks).map((response) => {
      setAnsweredQuestionnaires(response);
    });
  };

  const onQuestionnarieSubmit = (
    answers: NewQuestionnaireAnswer[],
    id: IpfsCID,
  ) => {
    console.log(answers, "FORM");
    okAsync(undefined);
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
          {unAnsweredQuestionnaires?.response.map((questionnaire, index) => {
            return (
              <Fragment key={`uaq-${questionnaire.id}`}>
                <QuestionnaireListItem
                  questionnaire={questionnaire}
                  onClick={() => {
                    setModal({
                      modalSelector: EModalSelectors.QUESTIONNAIRE_MODAL,
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
                {index !== unAnsweredQuestionnaires.response.length - 1 && (
                  <Divider />
                )}
              </Fragment>
            );
          })}
          {(answeredQuestionnaires?.response.length ?? 0) > 0 &&
            (unAnsweredQuestionnaires?.response.length ?? 0) > 0 && <Divider />}
          {answeredQuestionnaires?.response.map((questionnaire, index) => {
            return (
              <Fragment key={`aq-${questionnaire.id}`}>
                <QuestionnaireListItem
                  questionnaire={questionnaire}
                  onClick={() => {
                    setModal({
                      modalSelector:
                        EModalSelectors.ANSWERED_QUESTIONNAIRE_MODAL,
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
                {index !== answeredQuestionnaires.response.length - 1 && (
                  <Divider />
                )}
              </Fragment>
            );
          })}
        </Box>
      </Card>
    </>
  );
};

export default memo(Questionnaries);
