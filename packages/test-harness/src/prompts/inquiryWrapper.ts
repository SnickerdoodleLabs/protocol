import inquirer from "inquirer";
import { okAsync, ResultAsync } from "neverthrow";

export function inquiryWrapper(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  questions: inquirer.QuestionCollection,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): ResultAsync<inquirer.Answers, never> {
  return ResultAsync.fromPromise(inquirer.prompt(questions), (e) => {
    if ((e as any).isTtyError) {
      // Prompt couldn't be rendered in the current environment
      console.log("TtyError");
    }
    return e as Error;
  }).orElse((e) => {
    console.log("function prompt in index.ts", e);
    // Swallow the error, returns an empty answer
    return okAsync({});
  });
}
