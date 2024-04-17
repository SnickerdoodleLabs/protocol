import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  ChainId,
  WalletNFT,
  AccountAddress,
  EVMNFT,
  SolanaNFT,
  EChainTechnology,
  SuiNFT,
  getChainInfoByChain,
} from "@snickerdoodlelabs/objects";
import React, { useMemo, useState } from "react";

import AccountChainBar from "@extension-onboarding/components/AccountChainBar";
import {
  EVMNFTItem,
  SolanaNFTItem,
  SuiNFTItem,
} from "@extension-onboarding/components/NFTItem";
import Card from "@extension-onboarding/components/v2/Card";
import CustomSizeGrid from "@extension-onboarding/components/v2/CustomSizeGrid";
import EmptyItem from "@extension-onboarding/components/v2/EmptyItem";
import UnauthScreen from "@extension-onboarding/components/v2/UnauthScreen";
import { useAppContext } from "@extension-onboarding/context/App";
import { useDashboardContext } from "@extension-onboarding/context/DashboardContext";

export enum EDisplayMode {
  MAINNET,
  TESTNET,
}

export default () => {
  const { accountNFTs, accountTestnetNFTs, isNFTsLoading } =
    useDashboardContext();
  const [accountSelect, setAccountSelect] = useState<AccountAddress>();
  const [chainSelect, setChainSelect] = useState<ChainId>();
  const [displayMode, setDisplayMode] = useState<EDisplayMode>(
    EDisplayMode.MAINNET,
  );

  const { linkedAccounts } = useAppContext();

  const nftsToRender: Omit<WalletNFT, "getVersion">[] | null = useMemo(() => {
    if (accountNFTs && accountTestnetNFTs) {
      const nftArr =
        EDisplayMode.MAINNET === displayMode ? accountNFTs : accountTestnetNFTs;

      if (!accountSelect && !chainSelect) {
        return nftArr;
      }
      if (!accountSelect && chainSelect) {
        return nftArr.filter((item) => item.chain === chainSelect);
      }
      if (accountSelect && !chainSelect) {
        return nftArr.filter((item) => item.owner === accountSelect);
      }
      return nftArr.filter(
        (item) => item.owner === accountSelect && item.chain === chainSelect,
      );
    } else {
      return null;
    }
  }, [
    accountSelect,
    chainSelect,
    displayMode,
    accountNFTs,
    accountTestnetNFTs,
  ]);

  const { chains, accounts } = useMemo(() => {
    return [
      ...(accountNFTs || ([] as WalletNFT[])),
      ...(accountTestnetNFTs || ([] as WalletNFT[])),
    ].reduce(
      (acc, nft) => {
        if (!acc.accounts.includes(nft.owner)) {
          acc.accounts.push(nft.owner);
        }
        const nftChainId = getChainInfoByChain(nft.chain).chainId;
        if (!acc.chains.includes(nftChainId)) {
          acc.chains.push(nftChainId);
        }
        return acc;
      },
      {
        accounts: [] as AccountAddress[],
        chains: [] as ChainId[],
      },
    );
  }, [accountNFTs, accountTestnetNFTs]);

  if (!(linkedAccounts.length > 0)) {
    return <UnauthScreen />;
  }

  return (
    <Box>
      <AccountChainBar
        accountAdressesToRender={accounts}
        chainIdsToRender={chains}
        accountSelect={accountSelect}
        displayMode={displayMode}
        setDisplayMode={setDisplayMode}
        setAccountSelect={setAccountSelect}
        setChainSelect={setChainSelect}
        chainSelect={chainSelect}
      />
      <Box mt={3} />
      <Card>
        {isNFTsLoading ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            my={10}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {nftsToRender?.length ? (
              <CustomSizeGrid
                items={nftsToRender.map((nftItem) => {
                  if (nftItem.type === EChainTechnology.EVM) {
                    return (
                      <EVMNFTItem
                        key={JSON.stringify(nftItem)}
                        item={nftItem as EVMNFT}
                      />
                    );
                  } else if (nftItem.type === EChainTechnology.Sui) {
                    return (
                      <SuiNFTItem
                        key={JSON.stringify(nftItem)}
                        item={nftItem as SuiNFT}
                      />
                    );
                  } else {
                    return (
                      <SolanaNFTItem
                        key={JSON.stringify(nftItem)}
                        item={nftItem as SolanaNFT}
                      />
                    );
                  }
                })}
              />
            ) : (
              <EmptyItem />
            )}
          </>
        )}
      </Card>
    </Box>
  );
};
