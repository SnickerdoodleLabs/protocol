
export class OperandTypeError extends TypeError {
    constructor(message: string) { 
        super(message); 
    }
}

export class ConditionOperandTypeError extends OperandTypeError {
}

export class BooleanExpectedError extends OperandTypeError {

}
export class NumberExpectedError extends OperandTypeError {

}
export class StringExpectedError extends OperandTypeError {

}
export class ListExpectedError extends OperandTypeError {

}

export class URLExpectedError extends OperandTypeError {

}

export class EvalNotImplementedError extends Error {

    constructor(name: string) {
        super(`${name} not implemented`);
    }
}
