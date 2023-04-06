import { useAppContext } from "@extension-onboarding/context/App";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { NftMetadataParseUtils } from "@extension-onboarding/utils";
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
} from "react";
declare const window: IWindowWithSdlDataWallet;

interface IDashboardContext {
  accountNFTs?: WalletNFT[];
  accountTestnetNFTs?: WalletNFT[];
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

export const DashboardContextProvider: FC = ({ children }) => {
  const [accountNFTs, setAccountNFTs] = useState<WalletNFT[]>();
  const [poapNFTs, setPoapNFTs] = useState<EVMNFT[]>();
  const [accountTestnetNFTs, setAccountTestnetNFTs] = useState<WalletNFT[]>();
  const [isNFTsLoading, setIsNFTsLoading] = useState(true);
  const { linkedAccounts } = useAppContext();

  useEffect(() => {
    if (linkedAccounts.length) {
      setIsNFTsLoading(true);
      initializeNfts();
    }
  }, [linkedAccounts.length]);

  const initializeNfts = () => {
    window.sdlDataWallet
      .getAccountNFTs()
      .mapErr((e) => {
        setIsNFTsLoading(false);
      })
      .map((result) => {
        const structeredNfts = result.reduce(
          (acc, item) => {
            const isMainnetItem = mainnetSupportedChainIds.includes(item.chain);
            const isPopap =
              item.chain === EChain.Gnosis ||
              (item.type === EChainTechnology.EVM &&
                !!NftMetadataParseUtils.getParsedNFT(
                  JSON.stringify((item as EVMNFT).metadata) || "",
                ).event);

            if (isPopap) {
              acc.poapNfts = [...acc.poapNfts, item as EVMNFT];
            //   return acc;
            }
            if (isMainnetItem) {
              acc.mainnetNfts = [...acc.mainnetNfts, item];
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
};

export const useDashboardContext = () => useContext(DashboardContext);
