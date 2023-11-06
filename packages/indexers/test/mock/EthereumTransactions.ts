import {
  BigNumberString,
  EChain,
  EVMAccountAddress,
  EVMContractAddress,
  EVMTransaction,
  EVMTransactionHash,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";

const fujiChain = EChain.Fuji;
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

//
const invalidHashTx = validFullTransaction;
const invalidTimestampTx = validFullTransaction;
const invalidBlockHeightTx = validFullTransaction;
const invalidAccountAddressTx = validFullTransaction;
const invalidBigNumberTx = validFullTransaction;
const invalidStringsTx = validFullTransaction;

//
invalidHashTx.hash = EVMTransactionHash(`0`);
invalidTimestampTx.timestamp = UnixTimestamp(1);
invalidBlockHeightTx.blockHeight = -1;
invalidAccountAddressTx.to = EVMAccountAddress("0");
invalidBigNumberTx.value = BigNumberString("-1");

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
invalidStringsTx.input = 11;
export const invalidTransactions = [
  invalidHashTx,
  invalidTimestampTx,
  invalidBlockHeightTx,
  invalidAccountAddressTx,
  invalidBigNumberTx,
  invalidStringsTx,
];
