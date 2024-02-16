import { countries } from "@extension-onboarding/constants/countries";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  makeStyles,
} from "@material-ui/core";
import {
  EQuestionnaireQuestionType,
  EQuestionnaireQuestionDisplayType,
  NewQuestionnaireAnswer,
  Questionnaire,
  QuestionnaireQuestion,
  QuestionnaireWithAnswers,
} from "@snickerdoodlelabs/objects";
import { SDTypography, colors } from "@snickerdoodlelabs/shared-components";
import { Form, Formik, FastField, ErrorMessage } from "formik";
import {
  TextField,
  RadioGroup,
  Checkbox as FormikCheckbox,
} from "formik-material-ui";
import React, { FC, useEffect, useMemo } from "react";

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

const useStyles = makeStyles((theme) => ({
  checkboxLabel: {
    "&.MuiFormControlLabel-root": {
      margin: 0,
    },
  },
  inputCheckbox: {
    width: 20,
    height: 20,
    padding: 0,
    marginRight: 12,
  },
  radioWithLabel: {
    width: 20,
    height: 20,
    padding: 0,
    marginRight: 12,
  },
  radio: {
    width: 20,
    height: 20,
    padding: 0,
  },
  radioControl: {
    margin: 0,
  },
  radioRoot: {
    color: colors.GREY500,
  },
}));

function formatMultipleChoiceAnswer(choice, choices) {
  const isExpectedTypeNumeric = typeof (choices ?? [""])?.[0] === "number";
  return isExpectedTypeNumeric
    ? Array.isArray(choice)
      ? choice.map(Number)
      : Number(choice)
    : choice;
}

function shouldSkipAnswer(mode, questionnaire, answer, formattedAnswer) {
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
}

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
      return {
        ...question,
        choice:
          questionnaire instanceof QuestionnaireWithAnswers
            ? questionnaire.answers.find(
                (answer) => answer.questionIndex === question.index,
              )?.choice ?? defaultChoice
            : defaultChoice,
      };
    });
  }, [JSON.stringify(questionnaire)]);

  const [isFormDirty, setIsFormDirty] = React.useState(false);
  const classes = useStyles();

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
                <Grid container spacing={2}>
                  {question.choices?.map((choice, choiceIndex) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={choiceIndex}>
                      <FormControlLabel
                        label={choice}
                        className={classes.checkboxLabel}
                        control={
                          <FastField
                            className={classes.inputCheckbox}
                            name={`answers.${index}.choice`}
                            type="checkbox"
                            component={FormikCheckbox}
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
                            value={`${choice}`}
                          />
                        }
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
                component={RadioGroup}
                variant="outlined"
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
              >
                <Grid container spacing={2}>
                  {question.choices?.map((choice, choiceIndex) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={choiceIndex}>
                      <FormControlLabel
                        value={`${choice}`}
                        className={classes.checkboxLabel}
                        control={
                          <Radio
                            className={classes.radioWithLabel}
                            classes={{ root: classes.radioRoot }}
                          />
                        }
                        label={choice}
                      />
                    </Grid>
                  ))}
                </Grid>
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
              <Box display="flex" gridGap={24} alignItems="flex-end">
                {isLineer && <SDTypography>{question.lowerLabel}</SDTypography>}
                <FastField
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: isLineer ? "space-around" : "space-between",
                  }}
                  name={`answers.${index}.choice`}
                  component={RadioGroup}
                  variant="outlined"
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
                >
                  {question.choices?.map((choice, choiceIndex) => (
                    <FormControlLabel
                      key={choiceIndex}
                      value={`${choice}`}
                      className={classes.radioControl}
                      labelPlacement={isLineer ? "top" : "bottom"}
                      control={
                        <Radio
                          className={classes.radio}
                          classes={{ root: classes.radioRoot }}
                        />
                      }
                      label={choice}
                    />
                  ))}
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
              let formattedAnswer = choice;
              if (type === EQuestionnaireQuestionType.MultipleChoice) {
                formattedAnswer = formatMultipleChoiceAnswer(choice, choices);
              }

              if (
                shouldSkipAnswer(mode, questionnaire, answer, formattedAnswer)
              )
                return;

              processedAnswers.push(
                new NewQuestionnaireAnswer(
                  questionnaire.id,
                  index,
                  formattedAnswer,
                ),
              );
            });

            onSubmit(processedAnswers);
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
                        {question.required && (
                          <span
                            style={{
                              color: colors.RED500,
                            }}
                          >
                            *
                          </span>
                        )}
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

export default QuestionnaireForm;
