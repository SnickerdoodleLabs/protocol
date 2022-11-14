import { ResultAsync } from "neverthrow";

import { AccountBalanceError, AjaxError } from "@objects/errors";
import {
  BigNumberString,
  EVMContractAddress,
  TickerSymbol,
  UnixTimestamp,
  ChainId,
  EVMAccountAddress,
} from "@objects/primitives";
export interface IEVMBalance {
  ticker: TickerSymbol;
  chainId: ChainId;
  accountAddress: EVMAccountAddress;
  balance: BigNumberString; // TODO replace with a BigNumber type (please don't)
  contractAddress: EVMContractAddress;
  quoteBalance: number;
}

export interface IChainTransaction {
  chainId: ChainId;
  incomingValue: BigNumberString;
  incomingCount: BigNumberString;
  outgoingValue: BigNumberString;
  outgoingCount: BigNumberString;
  // timestamp: {
  //   start: UnixTimestamp;
  //   end: UnixTimestamp;
  // };
}

export class ChainTransaction {
  chainId: ChainId;
  incomingValue: BigNumberString;
  incomingCount: BigNumberString;
  outgoingValue: BigNumberString;
  outgoingCount: BigNumberString;

  constructor(
    chain: ChainId,
    incomingValue: BigNumberString,
    incomingCount: BigNumberString,
    outgoingValue: BigNumberString,
    outgoingCount: BigNumberString,
  ) {
    this.chainId = chain;
    this.incomingValue = incomingValue;
    this.incomingCount = incomingCount;
    this.outgoingValue = outgoingValue;
    this.outgoingCount = outgoingCount;
  }

  /*
  constructor() {
    // SUPPORTED_CHAINS is a comma-separated list
    // Need to split it into an array
    const supportedChains = __SUPPORTED_CHAINS__.split(",").map((chain) => {
      return ChainId(Number.parseInt(chain));
    });

    this.extensionConfig = new ExtensionConfig(
      __ONBOARDING_URL__,
      __ACCOUNT_COOKIE_URL__,
      Number.parseInt(__COOKIE_LIFETIME__),
      __MANIFEST_VERSION__,
      __PLATFORM__,
      ChainId(Number.parseInt(__CONTROL_CHAIN_ID__)),
      supportedChains,
      __IPFS_FETCH_BASE_URL__,
      __DEFAULT_INSIGHT_PLATFORM_BASE_URL__,
      __COVALENT_API_KEY__ === "" ? undefined : __COVALENT_API_KEY__,
      __MORALIS_API_KEY__ === "" ? undefined : __MORALIS_API_KEY__,
      __DNS_SERVER_ADDRESS__ === "" ? undefined : __DNS_SERVER_ADDRESS__,
    );
  }
  */
}

export interface ITokenBalance {
  ticker: TickerSymbol;
  networkId: ChainId;
  address: EVMContractAddress; // This is the token contract address
  balance: BigNumberString;
}

export interface IEVMAccountBalanceRepository {
  getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<IEVMBalance[], AccountBalanceError | AjaxError>;
}
