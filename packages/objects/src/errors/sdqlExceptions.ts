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

export class EvaluationError extends Error {}

export class ParserError extends Error {
  constructor(position: number, message: string) {
    super(`${position}: {$message}`);
  }
}

export class MissingTokenConstructorError extends Error {
  constructor(name: string) {
    super(`No Token type constructor defined for ${name}`);
  }
}

export class MissingRequiredFieldError extends Error {
  constructor(name: string) {
    super(`${name} not implemented`);
  }
}

export class DuplicateIdInSchema extends Error {
  constructor(name: string) {
    super(`${name} already exists in the parser context`);
  }
}

export class EvalNotImplementedError extends Error {
  constructor(name: string) {
    super(`${name} not implemented`);
  }
}

export class ReturnNotImplementedError extends Error {
  constructor(name: string) {
    super(`Return type for ${name} not implemented`);
  }
}

export class ParsingError extends Error {}

export class InvalidRegularExpression extends Error {}
