import {
  AccountIndexingError,
  AjaxError,
  BigNumberString,
  BlockNumber,
  ChainId,
  EChainTechnology,
  EVMAccountAddress,
  EVMContractAddress,
  EVMNFT,
  EVMTransaction,
  EVMTransactionHash,
  IEVMAccountBalanceRepository,
  IEVMNftRepository,
  IEVMTransactionRepository,
  TickerSymbol,
  TokenBalance,
  TokenUri,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";

export class SimulatorEVMTransactionRepository
  implements
    IEVMTransactionRepository,
    IEVMAccountBalanceRepository,
    IEVMNftRepository
{
  getTokensForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<EVMNFT[], AccountIndexingError> {
    const num = Math.floor(Math.random() * 10) + 1;
    const result: EVMNFT[] = [];
    for (let i = 0; i < num; i++) {
      const item = new EVMNFT(
        EVMContractAddress("EVMContractAddress#"),
        BigNumberString(`${Math.floor(Math.random() * 1000)}`),
        "erc721",
        accountAddress,
        TokenUri("tokenURI"),
        { raw: "metadata" },
        BigNumberString(Math.floor(Math.random() * 1000) + ""),
        "Fake Token #" + i,
        chainId,
        BlockNumber(i),
        //86400 => day
        UnixTimestamp(Date.now() - i * (Date.now() % 86400)),
      );
      result.push(item);
    }
    return okAsync(result);
  }

  getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError> {
    const num = Math.floor(Math.random() * 10);
    const result: TokenBalance[] = [];
    for (let i = 0; i < num; i++) {
      const item = new TokenBalance(
        EChainTechnology.EVM,
        TickerSymbol((Math.random() + 1).toString(36).substring(5)),
        chainId,
        EVMContractAddress(
          Math.floor(Math.random() * 4) +
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(
              Math.floor(Math.random() * 4),
            ),
        ),
        accountAddress,
        BigNumberString(Math.floor(Math.random() * 1000) + ""),
        18,
      );
      result.push(item);
    }
    return okAsync(result);
  }

  public getEVMTransactions(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<EVMTransaction[], AccountIndexingError | AjaxError> {
    const num = Math.floor(Math.random() * 10);
    const result: EVMTransaction[] = [];
    for (let i = 0; i < num; i++) {
      const timestamp =
        endTime == undefined
          ? new Date()
          : new Date(
              startTime.getTime() +
                Math.floor(
                  Math.random() * (endTime.getTime() - startTime.getTime()),
                ),
            );
      const item = new EVMTransaction(
        chainId,
        EVMTransactionHash("hash"),
        UnixTimestamp(timestamp.getTime() / 1000),
        null,
        accountAddress,
        null,
        BigNumberString(Math.floor(Math.random() * 1000) + ""),
        null,
        null,
        null,
        null,
        null,
        null,
      );
    }
    return okAsync(result);
  }
}
