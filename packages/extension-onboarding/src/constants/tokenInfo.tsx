interface ITokenInfo {
  [tickerSymbol: string]: { displayName: string; iconSrc: string };
}

export const tokenInfoObj: ITokenInfo = {
  ETH: {
    displayName: "Ethereum",
    iconSrc: "https://storage.googleapis.com/dw-assets/shared/icons/eth.png",
  },
  AVAX: {
    displayName: "AVAX",
    iconSrc:
      "https://storage.googleapis.com/dw-assets/shared/icons/avax-circle.png",
  },
  USDC: {
    displayName: "USDC",
    iconSrc:
      "https://storage.googleapis.com/dw-assets/shared/icons/usdc-circle.png",
  },
  MATIC: {
    displayName: "MATIC",
    iconSrc:
      "https://storage.googleapis.com/dw-assets/shared/icons/polygon-circle.png",
  },
  SOL: {
    displayName: "Sol",
    iconSrc: "https://storage.googleapis.com/dw-assets/shared/icons/sol.png",
  },
  xDAI: {
    displayName: "xDAI",
    iconSrc:
      "https://storage.googleapis.com/dw-assets/shared/icons/xDAI-circle.png",
  },
  BNB: {
    displayName: "Binance",
    iconSrc:
      "https://storage.googleapis.com/dw-assets/shared/icons/bnb-circle.png",
  },
  GLMR: {
    displayName: "Moonbeam",
    iconSrc:
      "https://storage.googleapis.com/dw-assets/shared/icons/moonbeam-circle.png",
  },

  ARB: {
    displayName: "Arbitrum",
    iconSrc:
      "https://storage.googleapis.com/dw-assets/shared/icons/arbitrum-circle.png",
  },
  OP: {
    displayName: "Optimism",
    iconSrc:
      "https://storage.googleapis.com/dw-assets/shared/icons/optimism-circle.png",
  },
  ASTR: {
    displayName: "Astar",
    iconSrc:
      "https://storage.googleapis.com/dw-assets/shared/icons/astar-logo.png",
  },
  SUI: {
    displayName: "Sui",
    iconSrc: "https://storage.googleapis.com/dw-assets/shared/icons/sui.png",
  },
};

export const stableCoins = [
  "USDC",
  "USDT",
  "BUSD",
  "DAI",
  "USDP",
  "TUSD",
  "USDD",
  "EURS",
  "xDAI",
  "BNB",
  "GLMR",
  "ARB",
  "OP",
  "ASTR",
  "SUI",
];
