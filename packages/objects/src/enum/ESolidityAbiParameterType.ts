// follows these ABI types https://docs.soliditylang.org/en/v0.8.19/abi-spec.html#types
export enum ESolidityAbiParameterType {
  address = "address",
  bool = "bool",
  bytes = "bytes", // dynamic sized byte sequence
  int = "int", // same as int256
  string = "string",
  uint = "uint", // same as uint256
}
