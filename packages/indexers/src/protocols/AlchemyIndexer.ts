import { Metaplex } from "@metaplex-foundation/js";
import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountIndexingError,
  AjaxError,
  ChainId,
  SolanaAccountAddress,
  TokenBalance,
  SolanaTransaction,
  EChain,
  URLString,
  SolanaTokenAddress,
  BigNumberString,
  ITokenPriceRepositoryType,
  ITokenPriceRepository,
  TickerSymbol,
  SolanaCollection,
  getChainInfoByChainId,
  getChainInfoByChain,
  EVMAccountAddress,
  EVMContractAddress,
  IEVMTransactionRepository,
  IEVMAccountBalanceRepository,
  IEVMNftRepository,
  EVMTransaction,
  EVMNFT,
} from "@snickerdoodlelabs/objects";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  GetProgramAccountsFilter,
} from "@solana/web3.js";
import { Network, Alchemy } from "alchemy-sdk";
import { BigNumber } from "ethers";
import { inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/interfaces/IIndexerConfigProvider.js";

export class AlchemyIndexer
  implements IEVMTransactionRepository, IEVMAccountBalanceRepository
{
  private _connections?: ResultAsync<SolClients, never>;
  private;

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  private getConnection(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<Alchemy, never> {
    const chain = getChainInfoByChain(chainId);
    console.log("chain: ", chain);
    return this.configProvider.getConfig().andThen((config) => {
      const key = config.alchemyEndpoints[chain.name.toString()];
      console.log("config.alchemyEndpoints: ", config.alchemyEndpoints);
      console.log("chain.name: ", chain.name);
      console.log("key: ", key);
      const settings = {
        apiKey: "f3mMgv03KKiX8h-pgOc9ZZyu7F9ECcHG",
        network: Network.OPT_MAINNET,
      };
      const alchemy = new Alchemy(settings);
      console.log("alchemy connection; ", alchemy);
      return okAsync(alchemy);
      //   const latestBlock = alchemy.core.getBlockNumber();
      //   const nfts = alchemy.nft.getNftsForOwner(accountAddress);
      //   console.log("nfts: ", nfts);
    });
  }

  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    return this.getConnection(chainId, accountAddress)
      .map(async (alchemy: Alchemy) => {
        console.log("alchemy: ", alchemy);
        const balances = alchemy.core.getTokenBalances(
          "0x633b0E4cc5b72e7196e12b6B8aF1d79c7D406C83",
        );
        return balances;
      })
      .andThen((balances) => {
        console.log("balances: ", balances);
        const alchemyBalances: TokenBalance[] = [];
        return okAsync(alchemyBalances);
      });
  }

  public getEVMTransactions(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<EVMTransaction[], AccountIndexingError | AjaxError> {
    return okAsync([]);
  }

  public getTokensForAccount(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<EVMNFT[], AccountIndexingError> {
    return okAsync([]);
  }

  public getSolanaTransactions(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<SolanaTransaction[], AccountIndexingError | AjaxError> {
    return okAsync([]); //TODO
  }

  private _getConnectionForChainId(
    chainId: ChainId,
  ): ResultAsync<[Connection, Metaplex], AccountIndexingError> {
    return this._getConnections().andThen((connections) => {
      switch (chainId) {
        case ChainId(EChain.Solana):
          return okAsync(connections.mainnet);
        case ChainId(EChain.SolanaTestnet):
          return okAsync(connections.testnet);
        default:
          return errAsync(
            new AccountIndexingError("invalid chain id for solana"),
          );
      }
    });
  }

  private _getConnections(): ResultAsync<SolClients, never> {
    if (this._connections) {
      return this._connections;
    }

    this._connections = this.configProvider.getConfig().andThen((config) => {
      return ResultUtils.combine([
        this._getConnectionForEndpoint(config.alchemyEndpoints.solana),
        this._getConnectionForEndpoint(config.alchemyEndpoints.solanaTestnet),
      ]).map(([mainnet, testnet]) => {
        return {
          mainnet,
          testnet,
        };
      });
    });

    return this._connections;
  }

  private _getConnectionForEndpoint(
    endpoint: string,
  ): ResultAsync<[Connection, Metaplex], never> {
    const connection = new Connection(endpoint);
    const metaplex = new Metaplex(connection);
    return okAsync([connection, metaplex]);
  }

  private _getParsedAccounts(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ) {
    return ResultUtils.combine([
      this._getConnectionForChainId(chainId),
      this._getFilters(accountAddress),
    ]).map(async ([[conn], filters]) => {
      const accounts = await conn.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
        filters: filters,
      });
      const balances = accounts.map((account) => {
        return account;
      });
      return balances;
    });
  }

  private _getFilters(
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<GetProgramAccountsFilter[], never> {
    const filters: GetProgramAccountsFilter[] = [
      {
        dataSize: 165, //size of account (bytes)
      },
      {
        memcmp: {
          offset: 32, //location of our query in the account (bytes)
          bytes: accountAddress, //our search criteria, a base58 encoded string
        },
      },
    ];
    return okAsync(filters);
  }

  private _lamportsToSol(lamports: number): BigNumberString {
    return BigNumberString((lamports / LAMPORTS_PER_SOL).toString());
  }
}

interface SolClients {
  mainnet: [Connection, Metaplex];
  testnet: [Connection, Metaplex];
}

type ISolscanBalanceResponse = {
  tokenAddress: SolanaTokenAddress;
  tokenAmount: {
    amount: BigNumberString;
    decimals: number;
    uiAmount: number;
    uiAmountString: BigNumberString;
  };
  tokenAccount: string;
  tokenName: string;
  tokenIcon: URLString;
  rentEpoch: number;
  lamports: number;
}[];

type IAlchemyBalanceResponse = {
  id: number;
  jsonrpc: string;
  result: {
    context: {
      slot: number;
    };
    value: {
      amount: string;
      decimals: number;
      uiAmountString: string;
    };
  };
};
