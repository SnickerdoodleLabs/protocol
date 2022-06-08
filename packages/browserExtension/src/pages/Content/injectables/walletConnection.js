let providersObject;

const Web3ProviderKeys = {
  METAMASK: "METAMASK",
  COINBASE: "COINBASE",
  TRUST: "TRUST",
  GOWALLET: "GOWALLET",
  ALPHAWALLET: "ALPHAWALLET",
  STATUS: "STATUS",
  MIST: "MIST",
  PARITY: "PARITY",
  INFURA: "INFURA",
  UNKNOWN: "UNKNOWN",
};

const getProviderKey = (provider) => {
  switch (true) {
    case provider.isMetaMask:
      return Web3ProviderKeys.METAMASK;
    case provider.isWalletLink:
      return Web3ProviderKeys.COINBASE;
    case provider.isTrust:
      return Web3ProviderKeys.TRUST;
    case provider.isGoWallet:
      return Web3ProviderKeys.GOWALLET;
    case provider.isAlphaWallet:
      return Web3ProviderKeys.ALPHAWALLET;
    case provider.isStatus:
      return Web3ProviderKeys.STATUS;
    case provider.constructor.name === "EthereumProvider":
      return Web3ProviderKeys.MIST;
    case provider.constructor.name === "Web3FrameProvider":
      return Web3ProviderKeys.PARITY;
    case provider?.host?.indexOf?.("infura") !== -1:
      return Web3ProviderKeys.INFURA;
    default:
      return null;
  }
};

const setProvidersObject = () => {
  if (!window.ethereum) {
    providersObject = {};
    return;
  }
  const providers = window?.ethereum?.providers ?? [window.ethereum];
  const providerList = [...new Set(providers)];
  providersObject = getFormattedProviders(providerList);
};

const getFormattedProviders = (providerList) =>
  providerList.reduce((acc, provider, index) => {
    acc[getProviderKey(provider, index)] = provider;
    return acc;
  }, {});

setProvidersObject();

const isMetamaskInstalled = () => {
  return !!providersObject[Web3ProviderKeys.METAMASK];
};

const getAccounts = async () => {
  return await window.ethereum.request({
    method: "eth_requestAccounts",
  });
};
const getSignature = async (
  signatureMessage
) => {
  const connectedProvider = new window.ethers.providers.Web3Provider(
    providersObject[Web3ProviderKeys.METAMASK],
  );
  const signer = connectedProvider.getSigner();

  const signature = await signer.signMessage(
   signatureMessage
  );

  const network = await connectedProvider.getNetwork();

  return { chainId: network?.chainId, signature };
};

document.addEventListener("SD_CONNECT_TO_WALLET_REQUEST", async (e) => {
  const checkMetamask = isMetamaskInstalled();
  if (!checkMetamask) {
    document.dispatchEvent(new CustomEvent("SD_METAMASK_NOT_INSTALLED"));
    return;
  }
  try {
    const signatureMessage = e?.detail?.signatureMessage;
    document.dispatchEvent(new CustomEvent("SD_WALLET_CONNECTION_PENDING"));
    const accounts = await getAccounts();
    document.dispatchEvent(new CustomEvent("SD_WALLET_CONNECTED"));
    const {signature, chainId} = await getSignature(signatureMessage);
    document.dispatchEvent(new CustomEvent("SD_WALLET_CONNECTION_COMPLETED", {detail: {  accounts, signature, chainId }}))
  } catch (e) {
    document.dispatchEvent(new CustomEvent("SD_WALLET_ERROR", {detail: {e}}))
  }
});
