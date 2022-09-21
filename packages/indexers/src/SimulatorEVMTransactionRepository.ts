import {
  AccountBalanceError,
  AccountIndexingError,
  AccountNFTError,
  AjaxError,
  BigNumberString,
  ChainId,
  EVMAccountAddress,
  EVMContractAddress,
  EVMTransaction,
  IEVMAccountBalanceRepository,
  IEVMBalance,
  IEVMNFT,
  IEVMNftRepository,
  IEVMTransactionRepository,
  TickerSymbol,
  TokenId,
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
  ): ResultAsync<IEVMNFT[], AjaxError | AccountNFTError> {
    const num = Math.floor(Math.random() * 10);
    const result: IEVMNFT[] = [];
    for (let i = 0; i < num; i++) {
      const item: IEVMNFT = {
        contract: EVMContractAddress("EVMContractAddress#" + i),
        tokenId: BigNumberString(`${Math.floor(Math.random() * 1000)}`),
        contractType: "erc721",
        owner: accountAddress,
        metadata: "metadata",
        amount: BigNumberString(Math.floor(Math.random() * 1000) + ""),
        name: "Fake Token #" + i,
        ticker: TickerSymbol((Math.random() + 1).toString(36).substring(5)),
        chain: chainId,
        tokenUri: TokenUri("tokenURI"),
      };
      result.push(item);
    }
    return okAsync(result);
  }

  getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<IEVMBalance[], AjaxError | AccountBalanceError> {
    const num = Math.floor(Math.random() * 10);
    const result: IEVMBalance[] = [];
    for (let i = 0; i < num; i++) {
      const item: IEVMBalance = {
        ticker: TickerSymbol((Math.random() + 1).toString(36).substring(5)),
        chainId: chainId,
        accountAddress: accountAddress,
        balance: BigNumberString(Math.floor(Math.random() * 1000) + ""),
        contractAddress: EVMContractAddress(
          Math.floor(Math.random() * 4) +
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(
              Math.floor(Math.random() * 4),
            ),
        ),
        quoteBalance: Math.random() * 1000,
      };
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
        "hash",
        UnixTimestamp(timestamp.getTime() / 1000),
        null,
        accountAddress,
        null,
        BigNumberString(Math.floor(Math.random() * 1000) + ""),
        null,
        null,
        null,
        null,
        Math.random() * 1000,
      );
    }
    return okAsync(result);
  }
}
