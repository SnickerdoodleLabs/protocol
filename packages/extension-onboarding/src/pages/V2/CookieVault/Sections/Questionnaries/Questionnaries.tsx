import { useModalStyles } from "@extension-onboarding/components/Modals/Modal.style";
import Card from "@extension-onboarding/components/v2/Card";
import CardTitle from "@extension-onboarding/components/v2/CardTitle";
import QuestionnarieForm from "@extension-onboarding/pages/V2/CookieVault/Sections/Questionnaries/QuestionnarieForm";
import QuestionnarieListItem from "@extension-onboarding/pages/V2/CookieVault/Sections/Questionnaries/QuestionnarieListItem";
import { Box, Dialog, Divider, makeStyles } from "@material-ui/core";

import {
  EQuestionnaireQuestionType,
  EQuestionnaireStatus,
  IpfsCID,
  MarketplaceTag,
  NewQuestionnaireAnswer,
  QuestionnaireAnswerId,
  PagedResponse,
  Questionnaire,
  QuestionnaireAnswer,
  QuestionnaireQuestion,
  QuestionnaireWithAnswers,
  URLString,
} from "@snickerdoodlelabs/objects";
import {
  CloseButton,
  SDButton,
  SDTypography,
  colors,
} from "@snickerdoodlelabs/shared-components";
import { okAsync } from "neverthrow";
import React, { Fragment, useEffect, useState } from "react";

const mockQuestionaries: PagedResponse<Questionnaire> =
  new PagedResponse<Questionnaire>(
    [
      new Questionnaire(
        IpfsCID("123"),
        MarketplaceTag("test"),
        EQuestionnaireStatus.Available,
        "About you",
        "This is a test questionnaire",
        URLString("https://picsum.photos/200/300"),
        [
          new QuestionnaireQuestion(
            0,
            EQuestionnaireQuestionType.Text,
            "What is your name?",
            null,
            true,
          ),
          new QuestionnaireQuestion(
            1,
            EQuestionnaireQuestionType.MultipleChoice,
            "What is your age group?",
            ["1-2", "3-4", "5-6", "7-8"],
            true,
          ),
          new QuestionnaireQuestion(
            3,
            EQuestionnaireQuestionType.MultipleChoice,
            "How often do you go to?",
            ["1-2", "3-4", "5-6", "7-8"],
            true,
          ),
          new QuestionnaireQuestion(
            2,
            EQuestionnaireQuestionType.Location,
            "What was the country you visited last?",
            null,
            false,
          ),
        ],
      ),
    ],
    1,
    20,
    40,
  );

const questionarrieWithAnswersMock: QuestionnaireWithAnswers =
  new QuestionnaireWithAnswers(
    IpfsCID("123"),
    MarketplaceTag("test"),
    EQuestionnaireStatus.Complete,
    "About you",
    "This is a test questionnaire",
    URLString("https://picsum.photos/200/300"),
    [
      new QuestionnaireQuestion(
        0,
        EQuestionnaireQuestionType.Text,
        "What is your name?",
        null,
        true,
      ),
      new QuestionnaireQuestion(
        1,
        EQuestionnaireQuestionType.MultipleChoice,
        "What is your age group?",
        ["1-2", "3-4", "5-6", "7-8"],
        true,
      ),
      new QuestionnaireQuestion(
        3,
        EQuestionnaireQuestionType.MultipleChoice,
        "How often do you go to?",
        ["1-2", "3-4", "5-6", "7-8"],
        true,
      ),
      new QuestionnaireQuestion(
        2,
        EQuestionnaireQuestionType.Location,
        "What was the country you visited last?",
        null,
        false,
      ),
    ],
    [
      new QuestionnaireAnswer(
        QuestionnaireAnswerId("123"),
        IpfsCID("123"),
        0,
        "John Doe",
        undefined as any,
      ),
      new QuestionnaireAnswer(
        QuestionnaireAnswerId("123"),
        IpfsCID("123"),
        1,
        "7-8",
        undefined as any,
      ),
    ],
  );

const answeredQuestionnariesMocks = new PagedResponse<QuestionnaireWithAnswers>(
  [questionarrieWithAnswersMock],
  1,
  20,
  40,
);

const useStyles = makeStyles((theme) => ({
  button: {
    cursor: "pointer",
    "&:hover $icon": {
      width: 18,
    },
  },
  icon: {
    fontSize: 18,
    width: 0,
    transition: "width 0.35s ease",
  },
}));

const Questionaries = () => {
  const classes = useStyles();
  const modalClasses = useModalStyles();
  const [unAnsweredQuestionnaries, setUnAnsweredQuestionnaries] =
    React.useState<PagedResponse<Questionnaire>>();

  const [answeredQuestionnaries, setAnsweredQuestionnaries] =
    React.useState<PagedResponse<QuestionnaireWithAnswers>>();

  useEffect(() => {
    getUnAnsweredQuestionnaries();
    getAnsweredQuestionnaries();
  }, []);

  const getUnAnsweredQuestionnaries = () => {
    okAsync(mockQuestionaries).map((response) => {
      setUnAnsweredQuestionnaries(response);
    });
  };

  const getAnsweredQuestionnaries = () => {
    okAsync(answeredQuestionnariesMocks).map((response) => {
      setAnsweredQuestionnaries(response);
    });
  };

  const [questionnarie, setQuestionnary] = useState<Questionnaire>();

  const [questionnarieWithAnswers, setQuestionnaryWithAnswers] =
    useState<QuestionnaireWithAnswers>();

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
        />
        <Box
          mt={4}
          border="1px solid"
          borderRadius={16}
          borderColor="borderColor"
        >
          {unAnsweredQuestionnaries?.response.map((questionnarie, index) => {
            return (
              <Fragment key={`uaq-${questionnarie.id}`}>
                <QuestionnarieListItem
                  questionnarie={questionnarie}
                  onClick={() => {
                    setQuestionnary(questionnarie);
                  }}
                />
                {index !== unAnsweredQuestionnaries.response.length - 1 && (
                  <Divider />
                )}
              </Fragment>
            );
          })}
          {(answeredQuestionnaries?.response.length ?? 0) > 0 &&
            (unAnsweredQuestionnaries?.response.length ?? 0) > 0 && <Divider />}
          {answeredQuestionnaries?.response.map((questionnarie, index) => {
            return (
              <Fragment key={`aq-${questionnarie.id}`}>
                <QuestionnarieListItem
                  questionnarie={questionnarie}
                  onClick={() => {
                    setQuestionnaryWithAnswers(questionnarie);
                  }}
                />
                {index !== answeredQuestionnaries.response.length - 1 && (
                  <Divider />
                )}
              </Fragment>
            );
          })}
        </Box>
      </Card>
      {questionnarie && (
        <Dialog
          open={!!questionnarie}
          fullWidth
          className={modalClasses.containerLg}
          disablePortal
        >
          <Box
            bgcolor="background.default"
            display="flex"
            flexDirection="column"
          >
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
              <CloseButton onClick={() => setQuestionnary(undefined)} />
            </Box>
            <Divider />
            <Box mt={6} />
            <Box width="90%" margin="auto">
              <Card>
                <QuestionnarieForm
                  onSubmit={(answers) => {
                    onQuestionnarieSubmit(answers, questionnarie.id);
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
      )}

      {questionnarieWithAnswers && (
        <Dialog
          open={!!questionnarieWithAnswers}
          fullWidth
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
                  src={questionnarieWithAnswers.image ?? ""}
                  alt={questionnarieWithAnswers.title}
                />
                <Box>
                  <SDTypography variant="titleMd" fontWeight="bold">
                    {questionnarieWithAnswers.title}
                  </SDTypography>
                  <Box mt={0.5} />
                  <SDTypography variant="titleSm">
                    {questionnarieWithAnswers.description}
                  </SDTypography>
                </Box>
              </Box>
              <CloseButton
                onClick={() => setQuestionnaryWithAnswers(undefined)}
              />
            </Box>
            <Box mt={6} />

            <QuestionnarieForm
              onSubmit={(answers) => {
                onQuestionnarieSubmit(answers, questionnarieWithAnswers.id);
              }}
              questionnarie={questionnarieWithAnswers}
            />
            <Box display="flex">
              <Box marginLeft="auto">
                <SDButton variant="outlined" type="submit" form="questionnarie">
                  Update Answers
                </SDButton>
              </Box>
            </Box>
          </Box>
        </Dialog>
      )}
    </>
  );
};

export default Questionaries;
