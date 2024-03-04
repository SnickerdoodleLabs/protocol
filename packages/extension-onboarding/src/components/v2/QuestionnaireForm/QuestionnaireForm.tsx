import { Box, Checkbox, Grid, MenuItem, makeStyles } from "@material-ui/core";
import {
  EQuestionnaireQuestionType,
  EQuestionnaireQuestionDisplayType,
  NewQuestionnaireAnswer,
  Questionnaire,
  QuestionnaireQuestion,
  QuestionnaireWithAnswers,
  EQuestionnaireStatus,
} from "@snickerdoodlelabs/objects";
import {
  SDCheckbox,
  SDRadio,
  SDTypography,
  colors,
} from "@snickerdoodlelabs/shared-components";
import { Form, Formik, FastField, ErrorMessage, FieldProps } from "formik";
import { TextField } from "formik-material-ui";
import React, { FC, useEffect, useMemo } from "react";

import { countries } from "@extension-onboarding/constants/countries";

interface IQuestionnaireFormProps {
  questionnaire: Questionnaire | QuestionnaireWithAnswers;
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
interface IQuestionnaireFormValues extends QuestionnaireQuestion {
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

const shouldSkipAnswer = (mode, questionnaire, answer, formattedAnswer) => {
  if (
    mode === Mode.UPDATE &&
    (questionnaire as QuestionnaireWithAnswers).answers.find(
      (a) =>
        a.questionIndex === answer.index &&
        areAnswersSame(a.choice, formattedAnswer),
    )
  ) {
    return true;
  }
  return false;
};

const QuestionnaireForm: FC<IQuestionnaireFormProps> = ({
  questionnaire,
  onSubmit,
  renderItem = defaultRenderItem,
  onDirtyStateChange,
}) => {
  const initialValues: IQuestionnaireFormValues[] = useMemo(() => {
    return questionnaire.questions.map((question) => {
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
      const choice =
        questionnaire.status === EQuestionnaireStatus.Complete
          ? (questionnaire as QuestionnaireWithAnswers).answers.find(
              (answer) => answer.questionIndex === question.index,
            )?.choice ?? defaultChoice
          : defaultChoice;
      return {
        ...question,
        choice,
      };
    });
  }, [JSON.stringify(questionnaire)]);

  const [isFormDirty, setIsFormDirty] = React.useState(false);

  const getQuestionByType = (
    question: QuestionnaireQuestion,
    index,
    values,
  ) => {
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
                validateBoundaries(value, question.minimum, question.maximum)
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
                <Grid container spacing={2}>
                  {question.choices?.map((choice, choiceIndex) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={choiceIndex}>
                      <FastField
                        type="checkbox"
                        name={`answers.${index}.choice`}
                        value={choice}
                        validate={(value) => {
                          return (
                            validateRequired(value, question.required) ||
                            validateBoundaries(
                              value,
                              question.minimum,
                              question.maximum,
                            )
                          );
                        }}
                        component={(props: FieldProps) => {
                          const { field, form } = props;
                          return (
                            <SDCheckbox
                              checked={field.checked}
                              onChange={() => {
                                form.setFieldTouched(
                                  `answers.${index}.choice`,
                                  true,
                                );
                                form.setFieldValue(
                                  `answers.${index}.choice`,
                                  field.checked
                                    ? form.values.answers[index].choice.filter(
                                        (c) => c !== choice,
                                      )
                                    : [
                                        ...form.values.answers[index].choice,
                                        choice,
                                      ],
                                );
                              }}
                              label={choice}
                            />
                          );
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
                <ErrorMessage name={`answers.${index}.choice`}>
                  {(msg) => (
                    <>
                      <Box mt={2} />
                      <SDTypography color="error" variant="bodyMd">
                        {msg}
                      </SDTypography>
                    </>
                  )}
                </ErrorMessage>
              </>
            );
          }
          return (
            <>
              <FastField
                name={`answers.${index}.choice`}
                validate={(value) => {
                  return (
                    validateRequired(value, question.required) ||
                    validateBoundaries(
                      value,
                      question.minimum,
                      question.maximum,
                    )
                  );
                }}
              >
                {(props: FieldProps) => {
                  const { field, form } = props;

                  return (
                    <>
                      <Grid container spacing={2}>
                        {question.choices?.map((choice, choiceIndex) => {
                          return (
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={4}
                              lg={3}
                              key={choiceIndex}
                            >
                              <SDRadio
                                key={choiceIndex}
                                label={choice}
                                checked={field.value === choice}
                                onChange={() => {
                                  form.setFieldValue(
                                    `answers.${index}.choice`,
                                    choice,
                                  );
                                }}
                              />
                            </Grid>
                          );
                        })}
                      </Grid>
                    </>
                  );
                }}
              </FastField>
              <ErrorMessage name={`answers.${index}.choice`}>
                {(msg) => (
                  <>
                    <Box mt={2} />
                    <SDTypography color="error" variant="bodyMd">
                      {msg}
                    </SDTypography>
                  </>
                )}
              </ErrorMessage>
            </>
          );
        }
        if (question.displayType === EQuestionnaireQuestionDisplayType.Scale) {
          const isLineer = question.lowerLabel && question.upperLabel;
          return (
            <>
              <Box
                display="flex"
                gridGap={{ xs: 4, sm: 24 }}
                alignItems="flex-end"
              >
                {isLineer && <SDTypography>{question.lowerLabel}</SDTypography>}
                <FastField
                  name={`answers.${index}.choice`}
                  variant="outlined"
                  validate={(value) => {
                    return (
                      validateRequired(value, question.required) ||
                      validateBoundaries(
                        value,
                        question.minimum,
                        question.maximum,
                      )
                    );
                  }}
                >
                  {(props: FieldProps) => {
                    const { field, form } = props;

                    return (
                      <Box
                        display="flex"
                        justifyContent={
                          isLineer ? "space-around" : "space-between"
                        }
                        flex={1}
                      >
                        {question.choices?.map((choice, choiceIndex) => {
                          return (
                            <SDRadio
                              labelPosition={isLineer ? "top" : "bottom"}
                              key={choiceIndex}
                              label={choice}
                              checked={field.value === choice}
                              onChange={() => {
                                form.setFieldValue(
                                  `answers.${index}.choice`,
                                  choice,
                                );
                              }}
                            />
                          );
                        })}
                      </Box>
                    );
                  }}
                </FastField>
                {isLineer && <SDTypography>{question.upperLabel}</SDTypography>}
              </Box>
              <ErrorMessage name={`answers.${index}.choice`}>
                {(msg) => (
                  <>
                    <Box mt={2} />
                    <SDTypography color="error" variant="bodyMd">
                      {msg}
                    </SDTypography>
                  </>
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
                validateBoundaries(value, question.minimum, question.maximum)
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
                {question.multiSelect ? (
                  <SDCheckbox
                    label={choice}
                    checked={values.answers[index].choice.indexOf(choice) > -1}
                  />
                ) : (
                  <SDTypography fontWeight="bold" variant="bodyLg">
                    {choice}
                  </SDTypography>
                )}
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
                      (v) =>
                        countries.find((country) => country.code == v)?.name,
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
                validateBoundaries(value, question.minimum, question.maximum)
              );
            }}
            fullWidth
          >
            {countries?.map((choice, choiceIndex) => (
              <MenuItem key={choiceIndex} value={choice.code}>
                {question.multiSelect ? (
                  <SDCheckbox
                    label={choice.name}
                    checked={
                      values.answers[index].choice.indexOf(choice.code) > -1
                    }
                  />
                ) : (
                  <SDTypography fontWeight="bold" variant="bodyLg">
                    {choice.name}
                  </SDTypography>
                )}
              </MenuItem>
            ))}
          </FastField>
        );
      default:
        return null;
    }
  };

  const mode = useMemo(() => {
    return questionnaire instanceof QuestionnaireWithAnswers
      ? Mode.UPDATE
      : Mode.CREATE;
  }, [JSON.stringify(questionnaire)]);

  useEffect(() => {
    onDirtyStateChange?.(isFormDirty);
  }, [isFormDirty]);

  return (
    <>
      {initialValues && (
        <Formik
          initialValues={{ answers: initialValues }}
          onSubmit={(values, actions) => {
            const processedAnswers: NewQuestionnaireAnswer[] = [];
            values.answers.forEach((answer) => {
              const { choice, index, type, choices } = answer;
              if (!choice || choice === "") return;
              if (Array.isArray(choice) && choice.length === 0) return;
              if (shouldSkipAnswer(mode, questionnaire, answer, choice)) return;
              processedAnswers.push(
                new NewQuestionnaireAnswer(questionnaire.id, index, choice),
              );
            });

            onSubmit(processedAnswers);
          }}
          validateOnBlur
        >
          {({ handleSubmit, dirty, values }) => {
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
                        {question.required && (
                          <span
                            style={{
                              color: colors.RED500,
                            }}
                          >
                            *
                          </span>
                        )}
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

export default QuestionnaireForm;
