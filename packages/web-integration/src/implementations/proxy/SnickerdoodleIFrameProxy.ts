import {
  Balances,
  ControlClaim,
  HypernetLink,
  PublicIdentifier,
  PullPayment,
  PushPayment,
  Payment,
  PaymentId,
  GatewayUrl,
  Signature,
  AcceptPaymentError,
  BlockchainUnavailableError,
  VectorError,
  BalancesUnavailableError,
  InsufficientBalanceError,
  GatewayValidationError,
  PersistenceError,
  GatewayConnectorError,
  ProxyError,
  InvalidParametersError,
  ISnickerdoodleCore,
  GatewayAuthorizationDeniedError,
  BigNumberString,
  ActiveStateChannel,
  ChainId,
  GatewayTokenInfo,
  GatewayRegistrationFilter,
  GatewayRegistrationInfo,
  Proposal,
  EProposalVoteSupport,
  ProposalVoteReceipt,
  Registry,
  RegistryEntry,
  RegistryParams,
  RegistryPermissionError,
  ERegistrySortOrder,
  RegistryFactoryContractError,
  NonFungibleRegistryContractError,
  HypernetGovernorContractError,
  ERC20ContractError,
  InvalidPaymentError,
  TransferCreationError,
  PaymentStakeError,
  TransferResolutionError,
  EthereumAccountAddress,
  EthereumContractAddress,
  ProviderId,
  TokenInformation,
  RegistryModule,
  BatchModuleContractError,
  InvalidPaymentIdError,
  LazyMintModuleContractError,
  RegistryTokenId,
  InitializeStatus,
  IPFSUnavailableError,
  CoreInitializationErrors,
  GovernanceSignerUnavailableError,
  LazyMintingSignature,
  ChainInformation,
  chainConfig,
  IHypernetPayments,
  IHypernetGovernance,
  IHypernetRegistries,
  RegistryName,
} from "@snickerdoodlelabs/objects";
import { ParentProxy } from "@snickerdoodlelabs/utils";
import { Result, ResultAsync, ok, okAsync } from "neverthrow";
import { Subject } from "rxjs";

export default class SnickerdoodleIFrameProxy
  extends ParentProxy
  implements ISnickerdoodleCore
{
  protected isInControl = false;
  protected _handshakePromise: Promise<void> | null;

  protected coreInitialized = false;
  protected waitInitializedPromise: Promise<void>;
  protected initializePromiseResolve: (() => void) | null;

  protected coreRegistriesInitialized = false;
  protected waitRegistriesInitializedPromise: Promise<void>;
  protected registriesInitializePromiseResolve: (() => void) | null;

  protected coreGovernanceInitialized = false;
  protected waitGovernanceInitializedPromise: Promise<void>;
  protected governanceInitializePromiseResolve: (() => void) | null;

  protected corePaymentsInitialized = false;
  protected waitPaymentsInitializedPromise: Promise<void>;
  protected paymentsInitializePromiseResolve: (() => void) | null;

  constructor(
    protected element: HTMLElement | null,
    protected iframeUrl: string,
    protected iframeName: string,
  ) {
    super(element, iframeUrl, iframeName);

    this._handshakePromise = null;

    this.onControlClaimed = new Subject();
    this.onControlYielded = new Subject();
    this.onPushPaymentSent = new Subject();
    this.onPullPaymentSent = new Subject();
    this.onPushPaymentReceived = new Subject();
    this.onPullPaymentReceived = new Subject();
    this.onPushPaymentUpdated = new Subject();
    this.onPullPaymentUpdated = new Subject();
    this.onPushPaymentDelayed = new Subject();
    this.onPullPaymentDelayed = new Subject();
    this.onPushPaymentCanceled = new Subject();
    this.onPullPaymentCanceled = new Subject();
    this.onBalancesChanged = new Subject<Balances>();
    this.onCeramicAuthenticationStarted = new Subject();
    this.onCeramicAuthenticationSucceeded = new Subject();
    this.onCeramicFailed = new Subject();
    this.onGatewayAuthorized = new Subject();
    this.onGatewayDeauthorizationStarted = new Subject();
    this.onAuthorizedGatewayUpdated = new Subject();
    this.onAuthorizedGatewayActivationFailed = new Subject();
    this.onGatewayIFrameDisplayRequested = new Subject();
    this.onGatewayIFrameCloseRequested = new Subject();
    this.onCoreIFrameDisplayRequested = new Subject();
    this.onCoreIFrameCloseRequested = new Subject();
    this.onInitializationRequired = new Subject();
    this.onPrivateCredentialsRequested = new Subject();
    this.onWalletConnectOptionsDisplayRequested = new Subject();
    this.onStateChannelCreated = new Subject();
    this.onChainConnected = new Subject();
    this.onGovernanceChainConnected = new Subject();
    this.onChainChanged = new Subject();
    this.onAccountChanged = new Subject();
    this.onGovernanceChainChanged = new Subject();
    this.onGovernanceAccountChanged = new Subject();
    this.onGovernanceSignerUnavailable = new Subject();

    this.initializePromiseResolve = null;
    this.waitInitializedPromise = new Promise((resolve) => {
      this.initializePromiseResolve = resolve;
    });

    this.registriesInitializePromiseResolve = null;
    this.waitRegistriesInitializedPromise = new Promise((resolve) => {
      this.registriesInitializePromiseResolve = resolve;
    });

    this.governanceInitializePromiseResolve = null;
    this.waitGovernanceInitializedPromise = new Promise((resolve) => {
      this.governanceInitializePromiseResolve = resolve;
    });

    this.paymentsInitializePromiseResolve = null;
    this.waitPaymentsInitializedPromise = new Promise((resolve) => {
      this.paymentsInitializePromiseResolve = resolve;
    });

    // Initialize the promise that we'll use to monitor the core
    // initialization status. The iframe will emit an event "initialized"
    // once the core is initialized, we'll use that to resolve this promise.
    this._handshakePromise = this.handshake.then((child) => {
      // Subscribe to the message streams from the iframe,
      // and convert them back to RXJS Subjects.
      child.on("onControlClaimed", (data: ControlClaim) => {
        this.isInControl = true;
        this.onControlClaimed.next(data);
      });

      child.on("onControlYielded", (data: ControlClaim) => {
        this.isInControl = false;
        this.onControlYielded.next(data);
      });

      child.on("onPushPaymentSent", (data: PushPayment) => {
        this.onPushPaymentSent.next(data);
      });

      child.on("onPullPaymentSent", (data: PullPayment) => {
        this.onPullPaymentSent.next(data);
      });

      child.on("onPushPaymentReceived", (data: PushPayment) => {
        this.onPushPaymentReceived.next(data);
      });

      child.on("onPullPaymentReceived", (data: PullPayment) => {
        this.onPullPaymentReceived.next(data);
      });

      child.on("onPushPaymentUpdated", (data: PushPayment) => {
        this.onPushPaymentUpdated.next(data);
      });

      child.on("onPullPaymentUpdated", (data: PullPayment) => {
        this.onPullPaymentUpdated.next(data);
      });

      child.on("onPushPaymentDelayed", (data: PushPayment) => {
        this.onPushPaymentDelayed.next(data);
      });

      child.on("onPullPaymentDelayed", (data: PullPayment) => {
        this.onPullPaymentDelayed.next(data);
      });

      child.on("onPushPaymentCanceled", (data: PushPayment) => {
        this.onPushPaymentCanceled.next(data);
      });

      child.on("onPullPaymentCanceled", (data: PullPayment) => {
        this.onPullPaymentCanceled.next(data);
      });

      child.on("onBalancesChanged", (data: Balances) => {
        this.onBalancesChanged.next(data);
      });

      child.on("onCeramicAuthenticationStarted", () => {
        //this._displayCoreIFrame();

        this.onCeramicAuthenticationStarted.next();
      });

      child.on("onCeramicAuthenticationSucceeded", () => {
        //this._closeCoreIFrame();

        this.onCeramicAuthenticationSucceeded.next();
      });

      child.on("onCeramicFailed", () => {
        this.onCeramicFailed.next();
      });

      child.on("onGatewayAuthorized", (data: GatewayUrl) => {
        this.onGatewayAuthorized.next(data);
      });

      child.on("onGatewayDeauthorizationStarted", (data: GatewayUrl) => {
        this.onGatewayDeauthorizationStarted.next(data);
      });

      child.on("onAuthorizedGatewayUpdated", (data: GatewayUrl) => {
        this.onAuthorizedGatewayUpdated.next(data);
      });

      child.on("onAuthorizedGatewayActivationFailed", (data: GatewayUrl) => {
        this.onAuthorizedGatewayActivationFailed.next(data);
      });

      child.on("onStateChannelCreated", (data: ActiveStateChannel) => {
        this.onStateChannelCreated.next(data);
      });

      child.on("onChainConnected", (data: ChainId) => {
        this.onChainConnected.next(data);
      });

      child.on("onGovernanceChainConnected", (data: ChainId) => {
        this.onGovernanceChainConnected.next(data);
      });

      child.on("onChainChanged", (data: ChainId) => {
        this.onChainChanged.next(data);
      });

      child.on("onAccountChanged", (data: EthereumAccountAddress) => {
        this.onAccountChanged.next(data);
      });

      child.on("onGovernanceChainChanged", (data: ChainId) => {
        this.onGovernanceChainChanged.next(data);
      });

      child.on("onGovernanceAccountChanged", (data: EthereumAccountAddress) => {
        this.onGovernanceAccountChanged.next(data);
      });

      child.on(
        "onGovernanceSignerUnavailable",
        (data: GovernanceSignerUnavailableError) => {
          this.onGovernanceSignerUnavailable.next(data);
        },
      );

      // Setup a listener for the "initialized" event.
      child.on("initialized", (data: ChainId) => {
        // Resolve waitInitialized
        if (this.initializePromiseResolve != null) {
          this.initializePromiseResolve();
        }

        // And mark us as initialized
        this.coreInitialized = true;
      });

      // Setup a listener for the "registriesInitialized" event.
      child.on("registriesInitialized", (data: ChainId) => {
        // Resolve waitRegistriesInitialized
        if (this.registriesInitializePromiseResolve != null) {
          this.registriesInitializePromiseResolve();
        }

        // And mark us as registries initialized
        this.coreRegistriesInitialized = true;
      });

      // Setup a listener for the "governanceInitialized" event.
      child.on("governanceInitialized", (data: ChainId) => {
        // Resolve waitGovernanceInitialized
        if (this.governanceInitializePromiseResolve != null) {
          this.governanceInitializePromiseResolve();
        }

        // And mark us as governance initialized
        this.coreGovernanceInitialized = true;
      });

      // Setup a listener for the "paymentsInitialized" event.
      child.on("paymentsInitialized", (data: ChainId) => {
        // Resolve waitGovernanceInitialized
        if (this.paymentsInitializePromiseResolve != null) {
          this.paymentsInitializePromiseResolve();
        }

        // And mark us as payments initialized
        this.corePaymentsInitialized = true;
      });

      child.on("onGatewayIFrameDisplayRequested", (data: GatewayUrl) => {
        this._displayCoreIFrame();

        this.onGatewayIFrameDisplayRequested.next(data);
      });

      child.on("onGatewayIFrameCloseRequested", (data: GatewayUrl) => {
        this._closeCoreIFrame();

        this.onGatewayIFrameCloseRequested.next(data);
      });

      child.on("onCoreIFrameDisplayRequested", () => {
        this._displayCoreIFrame();

        this.onCoreIFrameDisplayRequested.next();
      });

      child.on("onCoreIFrameCloseRequested", () => {
        this._closeCoreIFrame();

        this.onCoreIFrameCloseRequested.next();
      });

      child.on("onInitializationRequired", () => {
        this.onInitializationRequired.next();
      });

      child.on("onPrivateCredentialsRequested", () => {
        this.onPrivateCredentialsRequested.next();
      });

      child.on("onWalletConnectOptionsDisplayRequested", () => {
        this.onWalletConnectOptionsDisplayRequested.next();
      });
    });
  }

  public finalizePullPayment(
    _paymentId: PaymentId,
    _finalAmount: BigNumberString,
  ): Promise<HypernetLink> {
    throw new Error("Method not implemented.");
  }

  public initialized(chainId?: ChainId): ResultAsync<boolean, ProxyError> {
    // If the child is not initialized, there is no way the core can be.
    if (this.child == null) {
      return okAsync(false);
    }

    // Return the current known status of coreInitialized. We request this
    // information as soon as the child is up.
    return this._createCall("initialized", chainId);
  }

  public waitInitialized(chainId?: ChainId): ResultAsync<void, ProxyError> {
    if (this.coreInitialized === true) {
      return this._createCall("waitInitialized", chainId);
    } else {
      return ResultAsync.fromSafePromise(this.waitInitializedPromise);
    }
  }

  public inControl(): Result<boolean, never> {
    // If the child is not initialized, there is no way the core can be.
    if (this.child == null) {
      return ok(false);
    }

    // Return the current known status of inControl.
    return ok(this.isInControl);
  }

  public getEthereumAccounts(): ResultAsync<
    EthereumAccountAddress[],
    BlockchainUnavailableError | ProxyError
  > {
    return this._createCall("getEthereumAccounts", null);
  }

  public initialize(
    chainId?: ChainId,
  ): ResultAsync<InitializeStatus, CoreInitializationErrors> {
    return this._createCall("initialize", chainId);
  }

  public getInitializationStatus(): ResultAsync<InitializeStatus, ProxyError> {
    return this._createCall("getInitializationStatus", null);
  }

  public providePrivateCredentials(
    privateKey: string | null,
    mnemonic: string | null,
  ): ResultAsync<void, InvalidParametersError | ProxyError> {
    return this._createCall("providePrivateCredentials", {
      privateKey,
      mnemonic,
    });
  }

  public getBlockNumber(): ResultAsync<
    number,
    BlockchainUnavailableError | ProxyError
  > {
    return this._createCall("getBlockNumber", null);
  }

  public provideProviderId(
    providerId: ProviderId,
  ): ResultAsync<void, InvalidParametersError | ProxyError> {
    return this._createCall("provideProviderId", providerId);
  }

  public rejectProviderIdRequest(): ResultAsync<void, ProxyError> {
    return this._createCall("rejectProviderIdRequest", null);
  }

  public retrieveChainInformationList(): ResultAsync<
    Map<ChainId, ChainInformation>,
    ProxyError
  > {
    return this._createCall("retrieveChainInformationList", null);
  }

  public retrieveGovernanceChainInformation(): ResultAsync<
    ChainInformation,
    ProxyError
  > {
    return this._createCall("retrieveGovernanceChainInformation", null);
  }

  public initializeForChainId(
    chainId: ChainId,
  ): ResultAsync<void, CoreInitializationErrors> {
    return this._createCall("initializeForChainId", chainId);
  }

  public switchProviderNetwork(
    chainId: ChainId,
  ): ResultAsync<void, BlockchainUnavailableError | ProxyError> {
    return this._createCall("switchProviderNetwork", chainId);
  }

  public getMainProviderChainId(): ResultAsync<
    ChainId,
    BlockchainUnavailableError | ProxyError
  > {
    return this._createCall("getMainProviderChainId", null);
  }

  public payments: IHypernetPayments = {
    paymentsInitialized: (
      chainId?: ChainId,
    ): ResultAsync<boolean, ProxyError> => {
      return this._createCall("paymentsInitialized", chainId);
    },

    waitPaymentsInitialized: (
      chainId?: ChainId,
    ): ResultAsync<void, ProxyError> => {
      if (this.corePaymentsInitialized === true) {
        return this._createCall("waitPaymentsInitialized", chainId);
      } else {
        return ResultAsync.fromSafePromise(this.waitPaymentsInitializedPromise);
      }
    },

    initializePayments: (
      chainId?: ChainId,
    ): ResultAsync<InitializeStatus, CoreInitializationErrors> => {
      return this._createCall("initializePayments", chainId);
    },

    getPublicIdentifier: (): ResultAsync<PublicIdentifier, ProxyError> => {
      return this._createCall("getPublicIdentifier", null);
    },

    getActiveStateChannels: (): ResultAsync<
      ActiveStateChannel[],
      VectorError | BlockchainUnavailableError | PersistenceError | ProxyError
    > => {
      return this._createCall("getActiveStateChannels", null);
    },

    createStateChannel: (
      routerPublicIdentifiers: PublicIdentifier[],
      chainId: ChainId,
    ): ResultAsync<
      ActiveStateChannel,
      VectorError | BlockchainUnavailableError | PersistenceError | ProxyError
    > => {
      return this._createCall("createStateChannel", {
        routerPublicIdentifiers,
        chainId,
      });
    },

    depositFunds: (
      channelAddress: EthereumContractAddress,
      assetAddress: EthereumContractAddress,
      amount: BigNumberString,
    ): ResultAsync<
      Balances,
      | BalancesUnavailableError
      | BlockchainUnavailableError
      | VectorError
      | Error
    > => {
      return this._createCall("depositFunds", {
        channelAddress,
        assetAddress,
        amount: amount,
      });
    },

    withdrawFunds: (
      channelAddress: EthereumContractAddress,
      assetAddress: EthereumContractAddress,
      amount: BigNumberString,
      destinationAddress: EthereumAccountAddress,
    ): ResultAsync<
      Balances,
      | BalancesUnavailableError
      | BlockchainUnavailableError
      | VectorError
      | Error
    > => {
      return this._createCall("withdrawFunds", {
        channelAddress,
        assetAddress,
        amount: amount,
        destinationAddress,
      });
    },

    getBalances: (): ResultAsync<
      Balances,
      BalancesUnavailableError | VectorError | ProxyError
    > => {
      return this._createCall("getBalances", null);
    },

    getLinks: (): ResultAsync<HypernetLink[], VectorError | Error> => {
      return this._createCall("getLinks", null);
    },

    getActiveLinks: (): ResultAsync<HypernetLink[], VectorError | Error> => {
      return this._createCall("getActiveLinks", null);
    },

    acceptOffer: (
      paymentId: PaymentId,
    ): ResultAsync<
      Payment,
      | TransferCreationError
      | VectorError
      | BalancesUnavailableError
      | BlockchainUnavailableError
      | InvalidPaymentError
      | InvalidParametersError
      | PaymentStakeError
      | TransferResolutionError
      | AcceptPaymentError
      | InsufficientBalanceError
      | ProxyError
    > => {
      return this._createCall("acceptFunds", paymentId);
    },

    pullFunds: (
      paymentId: PaymentId,
      amount: BigNumberString,
    ): ResultAsync<Payment, VectorError | Error> => {
      return this._createCall("pullFunds", {
        paymentId,
        amount: amount,
      });
    },

    finalizePullPayment: (
      _paymentId: PaymentId,
      _finalAmount: BigNumberString,
    ): Promise<HypernetLink> => {
      throw new Error("Method not implemented.");
    },

    repairPayments: (
      paymentIds: PaymentId[],
    ): ResultAsync<
      void,
      | VectorError
      | BlockchainUnavailableError
      | InvalidPaymentError
      | InvalidParametersError
      | TransferResolutionError
      | InvalidPaymentIdError
      | ProxyError
    > => {
      return this._createCall("repairPayments", paymentIds);
    },

    mintTestToken: (
      amount: BigNumberString,
    ): ResultAsync<void, BlockchainUnavailableError | ProxyError> => {
      return this._createCall("mintTestToken", amount);
    },

    authorizeGateway: (
      gatewayUrl: GatewayUrl,
    ): ResultAsync<
      void,
      GatewayValidationError | PersistenceError | VectorError | ProxyError
    > => {
      return this._createCall("authorizeGateway", gatewayUrl);
    },

    deauthorizeGateway: (
      gatewayUrl: GatewayUrl,
    ): ResultAsync<
      void,
      PersistenceError | ProxyError | GatewayAuthorizationDeniedError
    > => {
      return this._createCall("deauthorizeGateway", gatewayUrl);
    },

    getAuthorizedGateways: (): ResultAsync<
      Map<GatewayUrl, Signature>,
      PersistenceError | VectorError | ProxyError
    > => {
      return this._createCall("getAuthorizedGateways", null);
    },

    getAuthorizedGatewaysConnectorsStatus: (): ResultAsync<
      Map<GatewayUrl, boolean>,
      PersistenceError | VectorError | ProxyError
    > => {
      return this._createCall("getAuthorizedGatewaysConnectorsStatus", null);
    },

    getGatewayTokenInfo: (
      gatewayUrls: GatewayUrl[],
    ): ResultAsync<
      Map<GatewayUrl, GatewayTokenInfo[]>,
      PersistenceError | ProxyError | GatewayAuthorizationDeniedError
    > => {
      return this._createCall("getGatewayTokenInfo", gatewayUrls);
    },

    getGatewayRegistrationInfo: (
      filter?: GatewayRegistrationFilter,
    ): ResultAsync<
      GatewayRegistrationInfo[],
      PersistenceError | VectorError | ProxyError
    > => {
      return this._createCall("getGatewayRegistrationInfo", filter);
    },

    getGatewayEntryList: (): ResultAsync<
      Map<GatewayUrl, GatewayRegistrationInfo>,
      | NonFungibleRegistryContractError
      | RegistryFactoryContractError
      | ProxyError
    > => {
      return this._createCall("getGatewayEntryList", null);
    },

    getTokenInformation: (): ResultAsync<TokenInformation[], ProxyError> => {
      return this._createCall("getTokenInformation", null);
    },

    getTokenInformationForChain: (
      chainId: ChainId,
    ): ResultAsync<TokenInformation[], ProxyError> => {
      return this._createCall("getTokenInformationForChain", chainId);
    },

    getTokenInformationByAddress: (
      tokenAddress: EthereumContractAddress,
    ): ResultAsync<TokenInformation | null, ProxyError> => {
      return this._createCall("getTokenInformationByAddress", tokenAddress);
    },

    displayGatewayIFrame: (
      gatewayUrl: GatewayUrl,
    ): ResultAsync<
      void,
      | GatewayConnectorError
      | PersistenceError
      | VectorError
      | BlockchainUnavailableError
      | ProxyError
    > => {
      return this.payments
        .getAuthorizedGatewaysConnectorsStatus()
        .andThen((gatewaysMap) => {
          if (gatewaysMap.get(gatewayUrl) == true) {
            this._displayCoreIFrame();

            return this._createCall<GatewayUrl, GatewayConnectorError, void>(
              "displayGatewayIFrame",
              gatewayUrl,
            );
          } else {
            alert(
              `Gateway ${gatewayUrl} is not activated at the moment, try again later`,
            );
            return okAsync(undefined);
          }
        });
    },

    closeGatewayIFrame: (
      gatewayUrl: GatewayUrl,
    ): ResultAsync<
      void,
      GatewayConnectorError | PersistenceError | VectorError | ProxyError
    > => {
      this._closeCoreIFrame();

      return this._createCall("closeGatewayIFrame", gatewayUrl);
    },
  };

  public governance: IHypernetGovernance = {
    governanceInitialized: (
      chainId?: ChainId,
    ): ResultAsync<boolean, ProxyError> => {
      return this._createCall("governanceInitialized", chainId);
    },

    waitGovernanceInitialized: (
      chainId?: ChainId,
    ): ResultAsync<void, ProxyError> => {
      if (this.coreGovernanceInitialized === true) {
        return this._createCall("waitGovernanceInitialized", chainId);
      } else {
        return ResultAsync.fromSafePromise(
          this.waitGovernanceInitializedPromise,
        );
      }
    },

    initializeGovernance: (
      chainId?: ChainId,
    ): ResultAsync<
      InitializeStatus,
      | GovernanceSignerUnavailableError
      | BlockchainUnavailableError
      | InvalidParametersError
      | ProxyError
    > => {
      return this._createCall("initializeGovernance", chainId);
    },

    getProposals: (
      pageNumber: number,
      pageSize: number,
    ): ResultAsync<Proposal[], HypernetGovernorContractError | ProxyError> => {
      return this._createCall("getProposals", {
        pageNumber,
        pageSize,
      });
    },

    createProposal: (
      name: string,
      symbol: string,
      owner: EthereumAccountAddress,
      enumerable: boolean,
    ): ResultAsync<Proposal, HypernetGovernorContractError | ProxyError> => {
      return this._createCall("createProposal", {
        name,
        symbol,
        owner,
        enumerable,
      });
    },

    delegateVote: (
      delegateAddress: EthereumAccountAddress,
      amount: number | null,
    ): ResultAsync<void, ERC20ContractError | ProxyError> => {
      return this._createCall("delegateVote", {
        delegateAddress,
        amount,
      });
    },

    getProposalDetails: (
      proposalId: string,
    ): ResultAsync<Proposal, HypernetGovernorContractError | ProxyError> => {
      return this._createCall("getProposalDetails", proposalId);
    },

    getProposalDescription: (
      descriptionHash: string,
    ): ResultAsync<
      string,
      IPFSUnavailableError | HypernetGovernorContractError | ProxyError
    > => {
      return this._createCall("getProposalDescription", descriptionHash);
    },

    castVote: (
      proposalId: string,
      support: EProposalVoteSupport,
    ): ResultAsync<Proposal, HypernetGovernorContractError | ProxyError> => {
      return this._createCall("castVote", {
        proposalId,
        support,
      });
    },

    getProposalVotesReceipt: (
      proposalId: string,
      voterAddress: EthereumAccountAddress,
    ): ResultAsync<
      ProposalVoteReceipt,
      HypernetGovernorContractError | ProxyError
    > => {
      return this._createCall("getProposalVotesReceipt", {
        proposalId,
        voterAddress,
      });
    },

    getProposalsCount: (): ResultAsync<
      number,
      HypernetGovernorContractError | ProxyError
    > => {
      return this._createCall("getProposalsCount", null);
    },

    getProposalThreshold: (): ResultAsync<
      number,
      HypernetGovernorContractError | ProxyError
    > => {
      return this._createCall("getProposalThreshold", null);
    },

    getVotingPower: (
      account: EthereumAccountAddress,
    ): ResultAsync<
      number,
      HypernetGovernorContractError | ERC20ContractError | ProxyError
    > => {
      return this._createCall("getVotingPower", account);
    },

    getHyperTokenBalance: (
      account: EthereumAccountAddress,
    ): ResultAsync<number, ERC20ContractError | ProxyError> => {
      return this._createCall("getHyperTokenBalance", account);
    },

    queueProposal: (
      proposalId: string,
    ): ResultAsync<Proposal, HypernetGovernorContractError | ProxyError> => {
      return this._createCall("queueProposal", proposalId);
    },

    cancelProposal: (
      proposalId: string,
    ): ResultAsync<Proposal, HypernetGovernorContractError | ProxyError> => {
      return this._createCall("cancelProposal", proposalId);
    },

    executeProposal: (
      proposalId: string,
    ): ResultAsync<Proposal, HypernetGovernorContractError | ProxyError> => {
      return this._createCall("executeProposal", proposalId);
    },
  };

  public registries: IHypernetRegistries = {
    registriesInitialized: (
      chainId?: ChainId,
    ): ResultAsync<boolean, ProxyError> => {
      return this._createCall("registriesInitialized", chainId);
    },

    waitRegistriesInitialized: (
      chainId?: ChainId,
    ): ResultAsync<void, ProxyError> => {
      if (this.coreRegistriesInitialized === true) {
        return this._createCall("waitRegistriesInitialized", chainId);
      } else {
        return ResultAsync.fromSafePromise(
          this.waitRegistriesInitializedPromise,
        );
      }
    },

    initializeRegistries: (
      chainId?: ChainId,
    ): ResultAsync<
      InitializeStatus,
      | GovernanceSignerUnavailableError
      | BlockchainUnavailableError
      | InvalidParametersError
      | ProxyError
    > => {
      return this._createCall("initializeRegistries", chainId);
    },

    getRegistries: (
      pageNumber: number,
      pageSize: number,
      sortOrder: ERegistrySortOrder,
    ): ResultAsync<
      Registry[],
      | RegistryFactoryContractError
      | NonFungibleRegistryContractError
      | ProxyError
    > => {
      return this._createCall("getRegistries", {
        pageNumber,
        pageSize,
        sortOrder,
      });
    },

    getRegistryByName: (
      registryNames: RegistryName[],
    ): ResultAsync<
      Map<RegistryName, Registry>,
      | RegistryFactoryContractError
      | NonFungibleRegistryContractError
      | ProxyError
    > => {
      return this._createCall("getRegistryByName", registryNames);
    },

    getRegistryByAddress: (
      registryAddresses: EthereumContractAddress[],
    ): ResultAsync<
      Map<EthereumContractAddress, Registry>,
      | RegistryFactoryContractError
      | NonFungibleRegistryContractError
      | ProxyError
    > => {
      return this._createCall("getRegistryByAddress", registryAddresses);
    },

    getRegistryEntriesTotalCount: (
      registryNames: RegistryName[],
    ): ResultAsync<
      Map<RegistryName, number>,
      | RegistryFactoryContractError
      | NonFungibleRegistryContractError
      | ProxyError
    > => {
      return this._createCall("getRegistryEntriesTotalCount", registryNames);
    },

    getRegistryEntries: (
      registryName: RegistryName,
      pageNumber: number,
      pageSize: number,
      sortOrder: ERegistrySortOrder,
    ): ResultAsync<
      RegistryEntry[],
      | RegistryFactoryContractError
      | NonFungibleRegistryContractError
      | ProxyError
    > => {
      return this._createCall("getRegistryEntries", {
        registryName,
        pageNumber,
        pageSize,
        sortOrder,
      });
    },

    getRegistryEntryDetailByTokenId: (
      registryName: RegistryName,
      tokenId: RegistryTokenId,
    ): ResultAsync<
      RegistryEntry,
      | RegistryFactoryContractError
      | NonFungibleRegistryContractError
      | ProxyError
    > => {
      return this._createCall("getRegistryEntryDetailByTokenId", {
        registryName,
        tokenId,
      });
    },

    updateRegistryEntryTokenURI: (
      registryName: RegistryName,
      tokenId: RegistryTokenId,
      registrationData: string,
    ): ResultAsync<
      RegistryEntry,
      | BlockchainUnavailableError
      | RegistryFactoryContractError
      | NonFungibleRegistryContractError
      | RegistryPermissionError
      | ProxyError
    > => {
      return this._createCall("updateRegistryEntryTokenURI", {
        registryName,
        tokenId,
        registrationData,
      });
    },

    updateRegistryEntryLabel: (
      registryName: RegistryName,
      tokenId: RegistryTokenId,
      label: string,
    ): ResultAsync<
      RegistryEntry,
      | BlockchainUnavailableError
      | RegistryFactoryContractError
      | NonFungibleRegistryContractError
      | RegistryPermissionError
      | ProxyError
    > => {
      return this._createCall("updateRegistryEntryLabel", {
        registryName,
        tokenId,
        label,
      });
    },

    getNumberOfRegistries: (): ResultAsync<
      number,
      | RegistryFactoryContractError
      | NonFungibleRegistryContractError
      | ProxyError
    > => {
      return this._createCall("getNumberOfRegistries", null);
    },

    updateRegistryParams: (
      registryParams: RegistryParams,
    ): ResultAsync<
      Registry,
      | NonFungibleRegistryContractError
      | RegistryFactoryContractError
      | BlockchainUnavailableError
      | RegistryPermissionError
      | ProxyError
    > => {
      return this._createCall("updateRegistryParams", registryParams);
    },

    createRegistryEntry: (
      registryName: RegistryName,
      newRegistryEntry: RegistryEntry,
    ): ResultAsync<
      void,
      | NonFungibleRegistryContractError
      | RegistryFactoryContractError
      | BlockchainUnavailableError
      | RegistryPermissionError
      | ProxyError
    > => {
      return this._createCall("createRegistryEntry", {
        registryName,
        newRegistryEntry,
      });
    },

    transferRegistryEntry: (
      registryName: RegistryName,
      tokenId: RegistryTokenId,
      transferToAddress: EthereumAccountAddress,
    ): ResultAsync<
      RegistryEntry,
      | NonFungibleRegistryContractError
      | RegistryFactoryContractError
      | BlockchainUnavailableError
      | RegistryPermissionError
      | ProxyError
    > => {
      return this._createCall("transferRegistryEntry", {
        registryName,
        tokenId,
        transferToAddress,
      });
    },

    burnRegistryEntry: (
      registryName: RegistryName,
      tokenId: RegistryTokenId,
    ): ResultAsync<
      void,
      | NonFungibleRegistryContractError
      | RegistryFactoryContractError
      | BlockchainUnavailableError
      | RegistryPermissionError
      | ProxyError
    > => {
      return this._createCall("burnRegistryEntry", {
        registryName,
        tokenId,
      });
    },

    createRegistryByToken: (
      name: string,
      symbol: string,
      registrarAddress: EthereumAccountAddress,
      enumerable: boolean,
    ): ResultAsync<
      void,
      | RegistryFactoryContractError
      | ERC20ContractError
      | BlockchainUnavailableError
      | ProxyError
    > => {
      return this._createCall("createRegistryByToken", {
        name,
        symbol,
        registrarAddress,
        enumerable,
      });
    },

    grantRegistrarRole: (
      registryName: RegistryName,
      address: EthereumAccountAddress | EthereumContractAddress,
    ): ResultAsync<
      void,
      | NonFungibleRegistryContractError
      | RegistryFactoryContractError
      | BlockchainUnavailableError
      | RegistryPermissionError
      | ProxyError
    > => {
      return this._createCall("grantRegistrarRole", {
        registryName,
        address,
      });
    },

    revokeRegistrarRole: (
      registryName: RegistryName,
      address: EthereumAccountAddress,
    ): ResultAsync<
      void,
      | NonFungibleRegistryContractError
      | RegistryFactoryContractError
      | BlockchainUnavailableError
      | RegistryPermissionError
      | ProxyError
    > => {
      return this._createCall("revokeRegistrarRole", {
        registryName,
        address,
      });
    },

    renounceRegistrarRole: (
      registryName: RegistryName,
      address: EthereumAccountAddress,
    ): ResultAsync<
      void,
      | NonFungibleRegistryContractError
      | RegistryFactoryContractError
      | BlockchainUnavailableError
      | RegistryPermissionError
      | ProxyError
    > => {
      return this._createCall("renounceRegistrarRole", {
        registryName,
        address,
      });
    },

    getRegistryEntryByOwnerAddress: (
      registryName: RegistryName,
      ownerAddress: EthereumAccountAddress,
      index: number,
    ): ResultAsync<
      RegistryEntry | null,
      | RegistryFactoryContractError
      | NonFungibleRegistryContractError
      | ProxyError
    > => {
      return this._createCall("getRegistryEntryByOwnerAddress", {
        registryName,
        ownerAddress,
        index,
      });
    },

    getRegistryModules: (): ResultAsync<
      RegistryModule[],
      | NonFungibleRegistryContractError
      | RegistryFactoryContractError
      | ProxyError
    > => {
      return this._createCall("getRegistryModules", null);
    },

    createBatchRegistryEntry: (
      registryName: RegistryName,
      newRegistryEntries: RegistryEntry[],
    ): ResultAsync<
      void,
      | BatchModuleContractError
      | RegistryFactoryContractError
      | NonFungibleRegistryContractError
      | ProxyError
    > => {
      return this._createCall("createBatchRegistryEntry", {
        registryName,
        newRegistryEntries,
      });
    },

    getRegistryEntryListByOwnerAddress: (
      registryName: string,
      ownerAddress: EthereumAccountAddress,
    ): ResultAsync<
      RegistryEntry[],
      | RegistryFactoryContractError
      | NonFungibleRegistryContractError
      | ProxyError
    > => {
      return this._createCall("getRegistryEntryListByOwnerAddress", {
        registryName,
        ownerAddress,
      });
    },

    getRegistryEntryListByUsername: (
      registryName: string,
      username: string,
    ): ResultAsync<
      RegistryEntry[],
      | RegistryFactoryContractError
      | NonFungibleRegistryContractError
      | ProxyError
    > => {
      return this._createCall("getRegistryEntryListByUsername", {
        registryName,
        username,
      });
    },

    submitLazyMintSignature: (
      registryName: string,
      tokenId: RegistryTokenId,
      ownerAddress: EthereumAccountAddress,
      registrationData: string,
    ): ResultAsync<
      void,
      | RegistryFactoryContractError
      | NonFungibleRegistryContractError
      | BlockchainUnavailableError
      | RegistryPermissionError
      | PersistenceError
      | VectorError
      | ProxyError
    > => {
      return this._createCall("submitLazyMintSignature", {
        registryName,
        tokenId,
        ownerAddress,
        registrationData,
      });
    },

    retrieveLazyMintingSignatures: (): ResultAsync<
      LazyMintingSignature[],
      PersistenceError | BlockchainUnavailableError | VectorError | ProxyError
    > => {
      return this._createCall("retrieveLazyMintingSignatures", null);
    },

    executeLazyMint: (
      lazyMintingSignature: LazyMintingSignature,
    ): ResultAsync<
      void,
      | InvalidParametersError
      | PersistenceError
      | VectorError
      | BlockchainUnavailableError
      | LazyMintModuleContractError
      | NonFungibleRegistryContractError
      | RegistryFactoryContractError
      | ProxyError
    > => {
      return this._createCall("executeLazyMint", lazyMintingSignature);
    },

    revokeLazyMintSignature: (
      lazyMintingSignature: LazyMintingSignature,
    ): ResultAsync<
      void,
      PersistenceError | VectorError | BlockchainUnavailableError | ProxyError
    > => {
      return this._createCall("revokeLazyMintSignature", lazyMintingSignature);
    },
  };

  private _displayCoreIFrame(): void {
    // Show core iframe
    if (this.child != null) {
      this.child.frame.style.display = "block";
    }

    // Show core iframe container
    if (this.element != null) {
      this.element.style.display = "block";
    }
  }

  private _closeCoreIFrame(): void {
    // Hide core iframe
    if (this.child != null) {
      this.child.frame.style.display = "none";
    }

    // Hide core iframe container
    if (this.element != null) {
      this.element.style.display = "none";
    }
  }

  /**
   * Observables for seeing what's going on
   */
  public onControlClaimed: Subject<ControlClaim>;
  public onControlYielded: Subject<ControlClaim>;
  public onPushPaymentSent: Subject<PushPayment>;
  public onPullPaymentSent: Subject<PullPayment>;
  public onPushPaymentUpdated: Subject<PushPayment>;
  public onPullPaymentUpdated: Subject<PullPayment>;
  public onPushPaymentReceived: Subject<PushPayment>;
  public onPullPaymentReceived: Subject<PullPayment>;
  public onPushPaymentDelayed: Subject<PushPayment>;
  public onPullPaymentDelayed: Subject<PullPayment>;
  public onPushPaymentCanceled: Subject<PushPayment>;
  public onPullPaymentCanceled: Subject<PullPayment>;
  public onBalancesChanged: Subject<Balances>;
  public onCeramicAuthenticationStarted: Subject<void>;
  public onCeramicAuthenticationSucceeded: Subject<void>;
  public onCeramicFailed: Subject<Error>;
  public onGatewayAuthorized: Subject<GatewayUrl>;
  public onGatewayDeauthorizationStarted: Subject<GatewayUrl>;
  public onAuthorizedGatewayUpdated: Subject<GatewayUrl>;
  public onAuthorizedGatewayActivationFailed: Subject<GatewayUrl>;
  public onGatewayIFrameDisplayRequested: Subject<GatewayUrl>;
  public onGatewayIFrameCloseRequested: Subject<GatewayUrl>;
  public onCoreIFrameDisplayRequested: Subject<void>;
  public onCoreIFrameCloseRequested: Subject<void>;
  public onInitializationRequired: Subject<void>;
  public onPrivateCredentialsRequested: Subject<void>;
  public onWalletConnectOptionsDisplayRequested: Subject<void>;
  public onStateChannelCreated: Subject<ActiveStateChannel>;
  public onChainConnected: Subject<ChainId>;
  public onGovernanceChainConnected: Subject<ChainId>;
  public onChainChanged: Subject<ChainId>;
  public onAccountChanged: Subject<EthereumAccountAddress>;
  public onGovernanceChainChanged: Subject<ChainId>;
  public onGovernanceAccountChanged: Subject<EthereumAccountAddress>;
  public onGovernanceSignerUnavailable: Subject<GovernanceSignerUnavailableError>;
}
