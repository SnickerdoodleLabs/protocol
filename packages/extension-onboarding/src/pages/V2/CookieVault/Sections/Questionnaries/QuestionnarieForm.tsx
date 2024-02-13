import { countries } from "@extension-onboarding/constants/countries";
import { Box, MenuItem, makeStyles } from "@material-ui/core";
import {
  EQuestionnaireQuestionType,
  NewQuestionnaireAnswer,
  Questionnaire,
  QuestionnaireQuestion,
  QuestionnaireWithAnswers,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { SDTypography } from "@snickerdoodlelabs/shared-components";
import { Form, Formik, Field } from "formik";
import { TextField } from "formik-material-ui";
import React, { FC, useMemo } from "react";

interface IQuestionnarieFormProps {
  questionnarie: Questionnaire | QuestionnaireWithAnswers;
  onSubmit: (answers: NewQuestionnaireAnswer[]) => void;
  renderItem?: (
    text: React.ReactNode,
    question: React.ReactNode,
    isLastItem: boolean,
  ) => React.ReactNode;
}

const defaultRenderItem = (
  text: React.ReactNode,
  question: React.ReactNode,
  isLastItem: boolean,
) => (
  <>
    {text}
    <Box mt={1} />
    {question}
    <Box mt={3} />
  </>
);

interface IQuestionnarieFormValues extends QuestionnaireQuestion {
  choice: string | number;
}

const validate = (value, isRequired) => {
  if (isRequired && value === "") {
    return "This field is required";
  }
  return undefined;
};

const QuestionnarieForm: FC<IQuestionnarieFormProps> = ({
  questionnarie,
  onSubmit,
  renderItem = defaultRenderItem,
}) => {
  const initialValues: IQuestionnarieFormValues[] = useMemo(() => {
    return questionnarie.questions.map((question, index) => {
      return {
        ...question,
        choice:
          questionnarie instanceof QuestionnaireWithAnswers
            ? questionnarie.answers.find(
                (answer) => answer.questionIndex === index,
              )?.choice ?? ""
            : "",
      };
    });
  }, [JSON.stringify(questionnarie)]);

  const getQuestionByType = (question: QuestionnaireQuestion, index) => {
    switch (question.type) {
      case EQuestionnaireQuestionType.Text:
        return (
          <Field
            name={`answers.${index}.choice`}
            component={TextField}
            variant="outlined"
            placeholder="Enter your answer"
            validate={(value) => {
              return validate(value, question.required);
            }}
            fullWidth
          />
        );
      case EQuestionnaireQuestionType.MultipleChoice:
        return (
          <Field
            name={`answers.${index}.choice`}
            component={TextField}
            select
            variant="outlined"
            validate={(value) => {
              return validate(value, question.required);
            }}
            SelectProps={{
              renderValue: (value) => {
                return value ? (
                  value
                ) : (
                  <SDTypography color="textLight" variant="bodyLg">
                    Select an option
                  </SDTypography>
                );
              },
            }}
            fullWidth
          >
            {question.choices?.map((choice, choiceIndex) => (
              <MenuItem key={choiceIndex} value={choice}>
                {choice}
              </MenuItem>
            ))}
          </Field>
        );
      case EQuestionnaireQuestionType.Location:
        return (
          <Field
            name={`answers.${index}.choice`}
            component={TextField}
            select
            variant="outlined"
            SelectProps={{
              renderValue: (value) => {
                return value ? (
                  countries.find((country) => country.code == value)?.name
                ) : (
                  <SDTypography color="textLight" variant="bodyLg">
                    Select an option
                  </SDTypography>
                );
              },
            }}
            validate={(value) => {
              return validate(value, question.required);
            }}
            fullWidth
          >
            {countries?.map((choice, choiceIndex) => (
              <MenuItem key={choiceIndex} value={choice.code}>
                {choice.name}
              </MenuItem>
            ))}
          </Field>
        );
      default:
        return null;
    }
  };
  return (
    <>
      {initialValues && (
        <Formik
          initialValues={{ answers: initialValues }}
          onSubmit={(values, actions) => {
            const answers: NewQuestionnaireAnswer[] = [];
            values.answers.forEach((answer) => {
              if (answer.choice !== "") {
                answers.push(
                  new NewQuestionnaireAnswer(
                    questionnarie.id,
                    answer.index,
                    answer.choice,
                    undefined as unknown as UnixTimestamp,
                  ),
                );
              }
            });
            onSubmit(answers);
          }}
          validateOnBlur
        >
          {({ handleSubmit }) => {
            return (
              <Form noValidate id="questionnarie" onSubmit={handleSubmit}>
                {initialValues.map((question, index) => (
                  <Box key={index}>
                    {renderItem(
                      <SDTypography variant="bodyLg" fontWeight="bold">
                        {question.text}
                      </SDTypography>,
                      getQuestionByType(question, index),
                      index === initialValues.length - 1,
                    )}
                  </Box>
                ))}
              </Form>
            );
          }}
        </Formik>
      )}
    </>
  );
};

export default QuestionnarieForm;
