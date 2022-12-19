import coinbaseSmall from "@extension-onboarding/assets/icons/coinbaseSmall.svg";
import metamaskLogo from "@extension-onboarding/assets/icons/metamaskSmall.svg";
import phantomSmall from "@extension-onboarding/assets/icons/phantomSmall.svg";
import { useStyles } from "@extension-onboarding/components/AccountChainBar/AccountChainBar.style";
import Switch from "@extension-onboarding/components/Switch";
import { EWalletProviderKeys } from "@extension-onboarding/constants";
import { tokenInfoObj } from "@extension-onboarding/constants/tokenInfo";
import { useAppContext } from "@extension-onboarding/context/App";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { Box, MenuItem, Select, Typography } from "@material-ui/core";
import {
  AccountAddress,
  chainConfig,
  ChainId,
  EChainType,
} from "@snickerdoodlelabs/objects";
import clsx from "clsx";
import React, { FC, useEffect, useMemo } from "react";

export enum EDisplayMode {
  MAINNET,
  TESTNET,
}

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

declare const window: IWindowWithSdlDataWallet;
interface IAccountChainBarProps {
  displayMode: EDisplayMode;
  accountSelect: AccountAddress | undefined;
  chainSelect: ChainId | undefined;
  setChainSelect: (chain?: ChainId) => void;
  setAccountSelect: (account: AccountAddress) => void;
  setDisplayMode: (displayMode: EDisplayMode) => void;
}
const AccountChainBar: FC<IAccountChainBarProps> = ({
  displayMode,
  setDisplayMode,
  accountSelect,
  setAccountSelect,
  setChainSelect,
  chainSelect,
}: IAccountChainBarProps) => {
  useEffect(() => {
    setChainSelect(undefined);
  }, [displayMode]);
  const classes = useStyles();
  const { linkedAccounts } = useAppContext();
  const handleAccountChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>,
  ) => {
    const value = (
      event.target.value === "all" ? undefined : event.target.value
    ) as AccountAddress;
    setAccountSelect(value);
  };

  const chainIdsToRender = useMemo(() => {
    if (EDisplayMode.MAINNET === displayMode) {
      return mainnetSupportedChainIds;
    }
    return testnetSupportedChainIds;
  }, [displayMode]);

  const walletIcon = (walletProvider: EWalletProviderKeys) => {
    switch (walletProvider) {
      case EWalletProviderKeys.METAMASK:
        return <img src={metamaskLogo} />;
        break;
      case EWalletProviderKeys.PHANTOM:
        return <img src={phantomSmall} />;
        break;
      case EWalletProviderKeys.COINBASE:
        return <img src={coinbaseSmall} />;
        break;

      default:
        return <img src={metamaskLogo} />;
        break;
    }
  };

  return (
    <Box mt={5} mb={2}>
      <Typography id="portfolio-test" className={classes.subTitle}>
        Accounts
      </Typography>
      <Box display="flex" justifyContent="space-between">
        <Box>
          <Select
            className={classes.selectAccount}
            fullWidth
            variant="outlined"
            name="accounts"
            value={accountSelect ?? "all"}
            placeholder="All"
            onChange={handleAccountChange}
          >
            <MenuItem value="all">All</MenuItem>
            {linkedAccounts?.map((account) => {
              return (
                <MenuItem
                  key={account.accountAddress}
                  value={account.accountAddress}
                >
                  <Box display="flex">
                    <Box>{walletIcon(account?.providerKey)}</Box>
                    <Typography className={classes.accountAddressText}>
                      {account.accountAddress.slice(0, 5)} ................
                      {account.accountAddress.slice(-4)}
                    </Typography>
                  </Box>
                </MenuItem>
              );
            })}
          </Select>
        </Box>
        <Box>
          <Box display="flex">
            <Box
              display="flex"
              py={0.75}
              px={1.5}
              borderRadius={16}
              {...(!chainSelect && {
                bgcolor: "rgba(245, 244, 245, 0.52)",
              })}
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                setChainSelect(undefined);
              }}
            >
              <Typography className={classes.buttonText}>All</Typography>
            </Box>
            {chainIdsToRender.map((chainId) => {
              const iconSrc =
                tokenInfoObj[
                  chainConfig.get(chainId)?.nativeCurrency?.symbol ?? ""
                ]?.iconSrc;
              return (
                <Box
                  p={0.75}
                  px={1.5}
                  display="flex"
                  borderRadius={16}
                  {...(chainSelect === chainId && {
                    bgcolor: "rgba(245, 244, 245, 0.52)",
                  })}
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setChainSelect(chainId);
                  }}
                >
                  <img src={iconSrc} style={{ width: 24, height: 24 }} />
                  <Typography className={classes.buttonText}>
                    {chainConfig.get(chainId)?.name}
                  </Typography>
                </Box>
              );
            })}
          </Box>
          <Box display="flex">
            <Box display="flex" alignItems="center" pr={1.5} marginLeft="auto">
              <Typography
                onClick={() => {
                  setDisplayMode(EDisplayMode.TESTNET);
                }}
                className={clsx(classes.switchNetwork, {
                  [classes.unfocused]: displayMode != EDisplayMode.TESTNET,
                })}
              >
                Testnet
              </Typography>
              <Switch
                checked={displayMode === EDisplayMode.MAINNET}
                value={displayMode === EDisplayMode.MAINNET}
                onChange={(e) => {
                  if (e.target.checked) {
                    setDisplayMode(EDisplayMode.MAINNET);
                  } else {
                    setDisplayMode(EDisplayMode.TESTNET);
                  }
                }}
              />
              <Typography
                onClick={() => {
                  setDisplayMode(EDisplayMode.MAINNET);
                }}
                className={clsx(classes.switchNetwork, {
                  [classes.unfocused]: displayMode != EDisplayMode.MAINNET,
                })}
              >
                Mainnet
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default AccountChainBar;
