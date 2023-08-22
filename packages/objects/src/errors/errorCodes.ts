const errorCodes = {
  AccountIndexingError: "ERR_ACCOUNT_INDEXER",
  AjaxError: "ERR_AJAX",
  BlockchainProviderError: "ERR_BLOCKCHAIN_PROVIDER",
  CloudStorageError: "ERR_CLOUD_STORAGE",
  ConsentContractRepositoryError: "CONSENT_CONTRACT_REPOSITORY_ERROR",
  ConsentContractError: "CONSENT_CONTRACT_ERROR",
  ConsentError: "ERR_NO_CONSENT_GIVEN",
  ConsentFactoryContractError: "CONSENT_FACTORY_CONTRACT_ERROR",
  CrumbsContractError: "CRUMBS_CONTRACT_ERROR",
  DatabaseError: "ERR_DATABASE",
  DataWalletLockedError: "ERR_DATA_WALLET_LOCKED",
  InvalidParametersError: "INVALID_PARAMETERS_ERROR",
  InvalidSignatureError: "ERR_INVALID_SIGNATURE",
  IPFSError: "ERR_IPFS",
  KeyGenerationError: "ERR_CRYPTO_KEY_GENERATION",
  MinimalForwarderContractError: "ERR_MINIMAL_FORWARDER_CONTRACT",
  JWKSError: "ERR_JWKS",
  PersistenceError: "ERR_PERSISTENCE",
  ProviderRpcError: "PROVIDER_RPC_ERROR",
  ProxyError: "ERR_PROXY",
  MissingWalletDataTypeError: "ERR_MISSING_WALLET_DATA_TYPE",
  PermissionError: "ERR_PERMISSION",
  QueryExpiredError: "ERR_QUERY_EXPIRED",
  MissingASTError: "ERR_MISSING_AST",
  ParserTypeNotImplementedError: "ERR_PARSER_TYPE_NOT_IMPLEMENTED",
  RewardsFactoryError: "ERR_REWARDS_FACTORY",
  ServerRewardError: "ERR_SERVER_REWARD",
  TransactionResponseError: "ERR_TRANSACTION_RESPONSE",
  DiscordError: "ERR_DISCORD",
  OAuthError: "ERR_OAuth",
  SiftContractError: "ERR_SIFT_CONTRACT",
  UnauthorizedError: "ERR_UNAUTHORIZED",
  UninitializedError: "ERR_UNINITIALIZED",
  UnsupportedLanguageError: "ERR_UNSUPPORTED_LANGUAGE",
  GasPriceError: "ERR_GAS_PRICE",
  InsufficientFundsError: "ERR_INSUFFICIENT_FUNDS",
  NetworkUnreachableError: "ERR_NETWORK_UNREACHABLE",
  InvalidArgumentError: "ERR_INVALID_ARGUMENT",
  MissingArgumentError: "ERR_MISSING_ARGUMENT",
  UnexpectedArgumentError: "ERR_UNEXPECTED_ARGUMENT",
  UnknownBlockchainError: "ERR_UNKNOWN_BLOCKCHAIN",
  GasTooLowError: "ERR_GAS_TOO_LOW",
  InvalidAddressError: "ERR_INVALID_ADDRESS",
  ExecutionRevertedError: "ERR_EXECUTION_REVERTED",
  ProofError: "ERR_PROOF",
  //SDQL errors
  OperandTypeError: "ER_SDQL_OPERAND_TYPE",
  ConditionOperandTypeError: "ERR_SDQL_CONDITION_OPERAND_TYPE",
  BooleanExpectedError: "ERR_SDQL_BOOLEAN_EXPECTED",
  NumberExpectedError: "ERR_SDQL_NUMBER_EXPECTED",
  StringExpectedError: "ERR_SDQL_STRING_EXPECTED",
  ListExpectedError: "ERR_SDQL_LIST_EXPECTED",
  URLExpectedError: "ERR_SDQL_URL_EXPECTED",
  EvaluationError: "ERR_SDQL_EVALUATION",
  SimulationError: "ERR_SDQL_SIMULATION",
  ParserError: "ERR_SDQL_PARSER",
  MissingTokenConstructorError: "ERR_SDQL_MISSING_TOKEN_CONSTRUCTOR",
  MissingRequiredFieldError: "ERR_SDQL_MISSING_REQUIRED_FIELD",
  DuplicateIdInSchema: "ERR_SDQL_DUPLICATE_ID_IN_SCHEMA",
  EvalNotImplementedError: "ERR_SDQL_EVAL_NOT_IMPLEMENTED",
  ReturnNotImplementedError: "ERR_SDQL_RETURN_NOT_IMPLEMENTED",
  ParsingError: "ERR_SDQL_PARSING",
  InvalidRegularExpression: "ERR_SDQL_INVALID_REGULAR_EXPRESSION",
  AuthenticationError: "ERR_AUTHENTICATION",
  ERC721RewardContractError: "ERR_ERC721_REWARD_CONTRACT",
  ERC20ContractError: "ERR_ERC20_CONTRACT",
};

export default errorCodes;
