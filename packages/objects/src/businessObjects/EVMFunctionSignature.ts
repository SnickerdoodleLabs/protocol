export class EVMFunctionParameter {
  constructor(public name: string, public type: string, public value: string) {}
}

export class EVMFunctionSignature {
  public constructor(
    public name: string,
    public type: string,
    public inputs: EVMFunctionParameter[],
  ) {}
}
