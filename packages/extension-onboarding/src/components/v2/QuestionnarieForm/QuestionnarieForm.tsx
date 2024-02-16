import { countries } from "@extension-onboarding/constants/countries";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
} from "@material-ui/core";
import {
  EQuestionnaireQuestionType,
  EQuestionnaireQuestionDisplayType,
  NewQuestionnaireAnswer,
  Questionnaire,
  QuestionnaireQuestion,
  QuestionnaireWithAnswers,
} from "@snickerdoodlelabs/objects";
import { SDTypography } from "@snickerdoodlelabs/shared-components";
import { Form, Formik, FastField, ErrorMessage } from "formik";
import {
  TextField,
  Select,
  RadioGroup,
  CheckboxWithLabel,
} from "formik-material-ui";
import React, { FC, useEffect, useMemo } from "react";

interface IQuestionnarieFormProps {
  questionnarie: Questionnaire | QuestionnaireWithAnswers;
  onSubmit: (answers: NewQuestionnaireAnswer[]) => void;
  onDirtyStateChange?: (isDirty: boolean) => void;
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

enum Mode {
  UPDATE = "UPDATE",
  CREATE = "CREATE",
}
interface IQuestionnarieFormValues extends QuestionnaireQuestion {
  choice: string | number | string[] | number[];
}

// #region utils
const validateRequired = (value, isRequired) => {
  if (
    isRequired &&
    (value === "" || (Array.isArray(value) && value.length === 0))
  ) {
    return "This field is required";
  }
  return undefined;
};

const validateBoundaries = (
  value: string | number | string[] | number[],
  min: number | null,
  max: number | null,
) => {
  if (value == "" || (Array.isArray(value) && value.length === 0))
    return undefined;
  if (Array.isArray(value)) {
    if (min && value.length < min) {
      return `Select at least ${min} options`;
    }
    if (max && value.length > max) {
      return `Select at most ${max} options`;
    }
  } else if (typeof value === "string") {
    if (min && value.length < min) {
      return `Value should be at least ${min} characters long`;
    }
    if (max && value.length > max) {
      return `Value should be at most ${max} characters long`;
    }
  } else {
    if (min && value < min) {
      return `Value should be greater than or equal to ${min}`;
    }
    if (max && value > max) {
      return `Value should be less than or equal to ${max}`;
    }
  }
  return undefined;
};

const areAnswersSame = (
  prev: number | string | number[] | string[],
  next: number | string | number[] | string[],
) => {
  if (Array.isArray(prev) && Array.isArray(next)) {
    return JSON.stringify(prev.sort()) === JSON.stringify(next.sort());
  }
  return prev === next;
};
// #endregion

const getQuestionByType = (question: QuestionnaireQuestion, index, values) => {
  switch (question.type) {
    case EQuestionnaireQuestionType.Numeric:
    case EQuestionnaireQuestionType.Text:
      return (
        <FastField
          name={`answers.${index}.choice`}
          component={TextField}
          {...(question.type === EQuestionnaireQuestionType.Numeric && {
            type: "number",
          })}
          variant="outlined"
          placeholder="Enter your answer"
          validate={(value) => {
            return (
              validateRequired(value, question.required) ||
              validateBoundaries(value, question.minumum, question.maximum)
            );
          }}
          fullWidth
        />
      );
    case EQuestionnaireQuestionType.MultipleChoice:
      if (question.displayType === EQuestionnaireQuestionDisplayType.List) {
        if (question.multiSelect) {
          return (
            <>
              <Box display={"flex"} gridGap={12}>
                {question.choices?.map((choice, choiceIndex) => (
                  <FormControlLabel
                    label={choice}
                    key={choiceIndex}
                    control={
                      <FastField
                        name={`answers.${index}.choice`}
                        component={CheckboxWithLabel}
                        validate={(value) => {
                          return (
                            validateRequired(value, question.required) ||
                            validateBoundaries(
                              value,
                              question.minumum,
                              question.maximum,
                            )
                          );
                        }}
                        value={choice}
                      />
                    }
                  />
                ))}
              </Box>
              <ErrorMessage name={`answers.${index}.choice`}>
                {(msg) => (
                  <SDTypography color="error" variant="bodySm">
                    {msg}
                  </SDTypography>
                )}
              </ErrorMessage>
            </>
          );
        }
        return (
          <>
            <FastField
              name={`answers.${index}.choice`}
              component={RadioGroup}
              variant="outlined"
              validate={(value) => {
                return (
                  validateRequired(value, question.required) ||
                  validateBoundaries(value, question.minumum, question.maximum)
                );
              }}
            >
              <Box display="flex" gridGap={12}>
                {question.choices?.map((choice, choiceIndex) => (
                  <FormControlLabel
                    key={choiceIndex}
                    value={choice}
                    control={<Radio />}
                    label={choice}
                  />
                ))}
              </Box>
            </FastField>
            <ErrorMessage name={`answers.${index}.choice`}>
              {(msg) => (
                <SDTypography color="error" variant="bodySm">
                  {msg}
                </SDTypography>
              )}
            </ErrorMessage>
          </>
        );
      }
      if (question.displayType === EQuestionnaireQuestionDisplayType.Scale) {
        const isLineer = question.lowerLabel && question.upperLabel;
        return (
          <>
            <FastField
              name={`answers.${index}.choice`}
              component={RadioGroup}
              variant="outlined"
              validate={(value) => {
                return (
                  validateRequired(value, question.required) ||
                  validateBoundaries(value, question.minumum, question.maximum)
                );
              }}
            >
              <Box display="flex" gridGap={12} alignItems="center">
                {isLineer && <SDTypography>{question.lowerLabel}</SDTypography>}
                <Box display="flex" gridGap={12}>
                  {question.choices?.map((choice, choiceIndex) => (
                    <FormControlLabel
                      key={choiceIndex}
                      value={choice}
                      labelPlacement={isLineer ? "top" : "bottom"}
                      control={<Radio />}
                      label={choice}
                    />
                  ))}
                </Box>
                {isLineer && <SDTypography>{question.upperLabel}</SDTypography>}
              </Box>
            </FastField>
            <ErrorMessage name={`answers.${index}.choice`}>
              {(msg) => (
                <SDTypography color="error" variant="bodySm">
                  {msg}
                </SDTypography>
              )}
            </ErrorMessage>
          </>
        );
      }
      return (
        <FastField
          name={`answers.${index}.choice`}
          component={TextField}
          select
          variant="outlined"
          validate={(value) => {
            return (
              validateRequired(value, question.required) ||
              validateBoundaries(value, question.minumum, question.maximum)
            );
          }}
          SelectProps={{
            multiple: question.multiSelect,
            renderValue: (value) => {
              if (question.multiSelect) {
                if (value.length === 0)
                  return (
                    <SDTypography color="textLight" variant="bodyLg">
                      Select options
                    </SDTypography>
                  );
                return value?.join(", ");
              }
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
              {question.multiSelect && (
                <Checkbox
                  checked={values.answers[index].choice.indexOf(choice) > -1}
                />
              )}
              {choice}
            </MenuItem>
          ))}
        </FastField>
      );
    case EQuestionnaireQuestionType.Location:
      return (
        <FastField
          name={`answers.${index}.choice`}
          component={TextField}
          select
          variant="outlined"
          SelectProps={{
            multiple: question.multiSelect,
            renderValue: (value) => {
              if (question.multiSelect) {
                if (value.length === 0)
                  return (
                    <SDTypography color="textLight" variant="bodyLg">
                      Select options
                    </SDTypography>
                  );
                return value
                  .map(
                    (v) => countries.find((country) => country.code == v)?.name,
                  )
                  ?.join(", ");
              }
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
            return (
              validateRequired(value, question.required) ||
              validateBoundaries(value, question.minumum, question.maximum)
            );
          }}
          fullWidth
        >
          {countries?.map((choice, choiceIndex) => (
            <MenuItem key={choiceIndex} value={choice.code}>
              {question.multiSelect && (
                <Checkbox
                  checked={
                    values.answers[index].choice.indexOf(choice.code) > -1
                  }
                />
              )}
              {choice.name}
            </MenuItem>
          ))}
        </FastField>
      );
    default:
      return null;
  }
};

const QuestionnarieForm: FC<IQuestionnarieFormProps> = ({
  questionnarie,
  onSubmit,
  renderItem = defaultRenderItem,
  onDirtyStateChange,
}) => {
  const initialValues: IQuestionnarieFormValues[] = useMemo(() => {
    return questionnarie.questions.map((question) => {
      let defaultChoice: string | null | string[] | number[];
      if (
        (question.type === EQuestionnaireQuestionType.MultipleChoice ||
          question.type === EQuestionnaireQuestionType.Location) &&
        question.multiSelect
      ) {
        defaultChoice = [];
      } else {
        defaultChoice = "";
      }
      return {
        ...question,
        choice:
          questionnarie instanceof QuestionnaireWithAnswers
            ? questionnarie.answers.find(
                (answer) => answer.questionIndex === question.index,
              )?.choice ?? defaultChoice
            : defaultChoice,
      };
    });
  }, [JSON.stringify(questionnarie)]);

  const [isFormDirty, setIsFormDirty] = React.useState(false);

  const mode = useMemo(() => {
    return questionnarie instanceof QuestionnaireWithAnswers
      ? Mode.UPDATE
      : Mode.CREATE;
  }, [JSON.stringify(questionnarie)]);

  useEffect(() => {
    onDirtyStateChange?.(isFormDirty);
  }, [isFormDirty]);

  return (
    <>
      {initialValues && (
        <Formik
          initialValues={{ answers: initialValues, test: [] }}
          onSubmit={(values, actions) => {
            const answers: NewQuestionnaireAnswer[] = [];
            values.answers.forEach((answer) => {
              if (answer && answer.choice !== "") {
                if (Array.isArray(answer.choice) && answer.choice.length === 0)
                  return;
                if (
                  mode === Mode.UPDATE &&
                  (questionnarie as QuestionnaireWithAnswers).answers.find(
                    (a) =>
                      a.questionIndex === answer.index &&
                      areAnswersSame(a.choice, answer.choice!),
                  )
                ) {
                  return;
                }
                answers.push(
                  new NewQuestionnaireAnswer(
                    questionnarie.id,
                    answer.index,
                    answer.choice,
                  ),
                );
              }
            });

            onSubmit(answers);
          }}
          validateOnBlur
        >
          {({ handleSubmit, dirty, values }) => {
            console.log(values);
            setTimeout(() => {
              setIsFormDirty(dirty);
            }, 0);
            return (
              <Form noValidate id="questionnarie" onSubmit={handleSubmit}>
                {initialValues.map((question, index) => (
                  <Box key={index}>
                    {renderItem(
                      <SDTypography variant="bodyLg" fontWeight="bold">
                        {question.text}
                      </SDTypography>,
                      getQuestionByType(question, index, values),
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
