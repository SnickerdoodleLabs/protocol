import { NftMetadataParseUtils } from "@snickerdoodlelabs/common-utils";
import {
  chainConfig,
  EChainType,
  ChainId,
  WalletNFT,
  EVMNFT,
  EChainTechnology,
  EChain,
} from "@snickerdoodlelabs/objects";
import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
  memo,
} from "react";

import { EAppModes, useAppContext } from "@extension-onboarding/context/App";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";

interface IDashboardContext {
  accountNFTs?: Omit<WalletNFT, "getVersion">[];
  accountTestnetNFTs?: Omit<WalletNFT, "getVersion">[];
  poapNFTs?: EVMNFT[];
  isNFTsLoading: boolean;
}

const DashboardContext = createContext<IDashboardContext>(
  {} as IDashboardContext,
);

const { mainnetSupportedChainIds, testnetSupportedChainIds } = Array.from(
  chainConfig.values(),
).reduce(
  (acc, chainInfo) => {
    if (chainInfo.type === EChainType.Mainnet) {
      acc.mainnetSupportedChainIds = [
        ...acc.mainnetSupportedChainIds,
        chainInfo.chainId,
      ];
    } else if (chainInfo.type === EChainType.Testnet) {
      acc.testnetSupportedChainIds = [
        ...acc.testnetSupportedChainIds,
        chainInfo.chainId,
      ];
    }
    return acc;
  },
  { mainnetSupportedChainIds: [], testnetSupportedChainIds: [] } as {
    mainnetSupportedChainIds: ChainId[];
    testnetSupportedChainIds: ChainId[];
  },
);

export const DashboardContextProvider: FC = memo(({ children }) => {
  const [accountNFTs, setAccountNFTs] = useState<WalletNFT[]>();
  const [poapNFTs, setPoapNFTs] = useState<EVMNFT[]>();
  const [accountTestnetNFTs, setAccountTestnetNFTs] = useState<WalletNFT[]>();
  const [isNFTsLoading, setIsNFTsLoading] = useState(true);
  const { sdlDataWallet } = useDataWalletContext();
  const { linkedAccounts, appMode } = useAppContext();

  useEffect(() => {
    if (appMode === EAppModes.AUTH_USER && linkedAccounts.length) {
      setIsNFTsLoading(true);
      initializeNfts();
    }
  }, [linkedAccounts.length, appMode]);

  const initializeNfts = () => {
    sdlDataWallet.nft
      .getNfts(undefined, undefined, undefined)
      .mapErr((e) => {
        setIsNFTsLoading(false);
      })
      .map((result) => {
        const structeredNfts = result.reduce(
          (acc, item) => {
            const isMainnetItem = mainnetSupportedChainIds.includes(
              ChainId(item.chain),
            );

            if (NftMetadataParseUtils.isEVMNFT(item)) {
              const evmNft = item as EVMNFT;
              if (
                evmNft.chain === EChain.Gnosis ||
                !!NftMetadataParseUtils.getParsedNFT(
                  JSON.stringify(evmNft.metadata) || "",
                ).event
              ) {
                acc.poapNfts = [...acc.poapNfts, evmNft];
                return acc;
              }
            }

            if (isMainnetItem) {
              acc.mainnetNfts = [
                ...acc.mainnetNfts,
                item as Omit<WalletNFT, "getVersion">,
              ];
              return acc;
            }
            acc.testnetNfts = [...acc.testnetNfts, item];
            return acc;
          },
          { mainnetNfts: [], testnetNfts: [], poapNfts: [] } as {
            mainnetNfts: WalletNFT[];
            testnetNfts: WalletNFT[];
            poapNfts: EVMNFT[];
          },
        );
        setAccountNFTs(structeredNfts.mainnetNfts);
        setAccountTestnetNFTs(structeredNfts.testnetNfts);
        setPoapNFTs(structeredNfts.poapNfts);
        setIsNFTsLoading(false);
      });
  };

  return (
    <DashboardContext.Provider
      value={{ accountNFTs, accountTestnetNFTs, poapNFTs, isNFTsLoading }}
    >
      {children}
    </DashboardContext.Provider>
  );
});

export const useDashboardContext = () => useContext(DashboardContext);
