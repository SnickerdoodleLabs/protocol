import errorCodes from "@objects/errors/errorCodes.js";
import { BaseError } from "@objects/errors/BaseError.js";

export class OperandTypeError extends TypeError {
  constructor(message: string) {
    super(message);
  }
}

export class ConditionOperandTypeError extends OperandTypeError {}

export class BooleanExpectedError extends OperandTypeError {}
export class NumberExpectedError extends OperandTypeError {}
export class StringExpectedError extends OperandTypeError {}
export class ListExpectedError extends OperandTypeError {}

export class URLExpectedError extends OperandTypeError {}
export class EvaluationError extends BaseError {
  protected errorCode: string = errorCodes[EvaluationError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[EvaluationError.name], src, false);
  }
}

export class ParserError extends BaseError {
  protected errorCode: string = errorCodes[ParserError.name];
  constructor(position: number, message: string, public src?: unknown) {
    super(`${position}: ${message}`, 500, errorCodes[ParserError.name], src, false);
  }
}

export class MissingTokenConstructorError extends BaseError {
  protected errorCode: string = errorCodes[MissingTokenConstructorError.name];
  constructor(message: string, public src?: unknown) {
    super(
      message,
      500,
      errorCodes[MissingTokenConstructorError.name],
      src,
      false,
    );
  }
}

export class MissingRequiredFieldError extends BaseError {
  protected errorCode: string = errorCodes[MissingRequiredFieldError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[MissingRequiredFieldError.name], src, false);
  }
}

export class DuplicateIdInSchema extends BaseError {
  protected errorCode: string = errorCodes[DuplicateIdInSchema.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[DuplicateIdInSchema.name], src, false);
  }
}

export class EvalNotImplementedError extends BaseError {
  protected errorCode: string = errorCodes[EvalNotImplementedError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[EvalNotImplementedError.name], src, false);
  }
}

export class ReturnNotImplementedError extends BaseError {
  protected errorCode: string = errorCodes[ReturnNotImplementedError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[ReturnNotImplementedError.name], src, false);
  }
}

export class ParsingError extends BaseError {
  protected errorCode: string = errorCodes[ParsingError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[ParsingError.name], src, false);
  }
}

export class InvalidRegularExpression extends BaseError {
  protected errorCode: string = errorCodes[InvalidRegularExpression.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[InvalidRegularExpression.name], src, false);
  }
}
