import {
  BigNumberString,
  EChain,
  EVMAccountAddress,
  EVMContractAddress,
  EVMTransaction,
  EVMTransactionHash,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";

const fujiChain = EChain.EthereumMainnet;
const validHash = EVMTransactionHash(
  "0x9510a7c27e9be68cf1b8d585501321a7937258b6b9329fc79899368033ca075e",
);
const validTimestamp = UnixTimestamp(1649681753);
const validBlockHeight = 8428003;
const validAccountAddress = EVMAccountAddress(
  "0xf20c9dbdb312a90e2068f395e6d251cc6b683845",
);
const validContractAddress = EVMContractAddress(
  "0xf20c9dbdb312a90e2068f395e6d251cc6b683845",
);
const validNumberValue = BigNumberString("0");
const validHexValue = BigNumberString("0x0");
const validInput = "0x2f2ff15d408a36151f841709116a4e8aca4e0202";
const validMethodId = "0x2f2ff15d";
const validGasPrice = BigNumberString("25000000000");
const validFunctionName = "grantRole(bytes32 role, address account)";

export const validMixedCaseAddress = EVMAccountAddress(
  "0x1f9090aaE28b8a3dCeaDf281B0F12828e676c326",
);
const validFullTransaction = new EVMTransaction(
  fujiChain,
  validHash,
  validTimestamp,
  validBlockHeight,
  validAccountAddress,
  validAccountAddress,
  validNumberValue,
  validGasPrice,
  validContractAddress,
  validInput,
  validMethodId,
  validFunctionName,
  [],
  validTimestamp,
);
const validFullTransaction2 = new EVMTransaction(
  fujiChain,
  validHash,
  validTimestamp,
  validBlockHeight,
  validAccountAddress,
  validAccountAddress,
  validHexValue,
  validGasPrice,
  validContractAddress,
  validInput,
  validMethodId,
  validFunctionName,
  [],
  validTimestamp,
);

const validNulledTransaction = new EVMTransaction(
  fujiChain,
  validHash,
  validTimestamp,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  validTimestamp,
);

export const validEVMTransactions = [
  validFullTransaction,
  validFullTransaction2,
  validNulledTransaction,
];

const upperCaseTx = Object.assign({}, validFullTransaction);

upperCaseTx.to = validMixedCaseAddress;
upperCaseTx.from = validMixedCaseAddress;

export const validUpperCaseEVMTransactions = [upperCaseTx];

const invalidHashTx = Object.assign({}, validFullTransaction);

const invalidAccountAddressTx = Object.assign({}, validFullTransaction);
const invalidBigNumberTx = Object.assign({}, validFullTransaction);

const invalidStringsTx = Object.assign({}, validFullTransaction);

//
invalidHashTx.hash = EVMTransactionHash(`0`);

invalidAccountAddressTx.to = EVMAccountAddress("0");
invalidBigNumberTx.value = BigNumberString("-1");

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
invalidStringsTx.input = 11;
export const invalidEVMTransactions = [
  invalidHashTx,
  invalidAccountAddressTx,
  invalidBigNumberTx,
  invalidStringsTx,
];

const invalidHexStringTimestampTx = Object.assign({}, validFullTransaction); //1
const invalidNumberStringTimestampTx = Object.assign({}, validFullTransaction); //1
const invalidValueTx = Object.assign({}, validFullTransaction); //1
const invalidBlockHeightTx = Object.assign({}, validFullTransaction); //1

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
invalidHexStringTimestampTx.timestamp = UnixTimestamp("0x62eba12f");
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
invalidNumberStringTimestampTx.timestamp = "1659609391";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
invalidValueTx.value = 0;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
invalidBlockHeightTx.blockHeight = "1";
export const invalidButCanBeNormalizedTransactions = [
  invalidHexStringTimestampTx,
  invalidNumberStringTimestampTx,
  invalidBlockHeightTx,
  invalidValueTx,
];
