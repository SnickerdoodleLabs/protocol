import { useStyles } from "@extension-onboarding/components/AccountChainBar/AccountChainBar.style";
import AccountIdentIcon from "@extension-onboarding/components/AccountIdentIcon";
import Switch from "@extension-onboarding/components/Switch";
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

  const handleChainChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>,
  ) => {
    const value = (
      event.target.value === "all" ? undefined : event.target.value
    ) as ChainId;
    setChainSelect(value);
  };

  const chainIdsToRender = useMemo(() => {
    if (EDisplayMode.MAINNET === displayMode) {
      return mainnetSupportedChainIds;
    }
    return testnetSupportedChainIds;
  }, [displayMode]);

  return (
    <Box mt={5} display="flex" mb={2}>
      <Box>
        <Typography id="portfolio-test" className={classes.subTitle}>
          Accounts
        </Typography>
        <Box mt={0.5} display="flex" justifyContent="space-between">
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
                    key={account.accountInfo.sourceAccountAddress}
                    value={account.accountInfo.sourceAccountAddress}
                  >
                    <Box display="flex" alignItems="center">
                      <Box>
                        <AccountIdentIcon
                          accountAddress={
                            account.accountInfo.sourceAccountAddress
                          }
                        />
                      </Box>
                      <Typography className={classes.accountAddressText}>
                        {account.accountInfo.sourceAccountAddress.slice(0, 5)}{" "}
                        ................
                        {account.accountInfo.sourceAccountAddress.slice(-4)}
                      </Typography>
                    </Box>
                  </MenuItem>
                );
              })}
            </Select>
          </Box>
        </Box>
      </Box>
      <Box display="flex" marginLeft="auto" alignItems="center">
        <Box>
          <Typography id="portfolio-test" className={classes.subTitle}>
            Chain
          </Typography>
          <Box mt={0.5} display="flex" justifyContent="space-between">
            <Box>
              <Select
                className={classes.selectAccount}
                fullWidth
                variant="outlined"
                name="chains"
                value={chainSelect ?? "all"}
                placeholder="All"
                onChange={handleChainChange}
              >
                <MenuItem value="all">All</MenuItem>
                {chainIdsToRender.map((chainId) => {
                  const iconSrc =
                    tokenInfoObj[
                      chainConfig.get(chainId)?.nativeCurrency?.symbol ?? ""
                    ]?.iconSrc;
                  return (
                    <MenuItem key={chainId} value={chainId}>
                      <Box display="flex" alignItems="center">
                        <img
                          src={iconSrc}
                          style={{ width: 24, height: 24, marginRight: 8 }}
                        />
                        <Typography className={classes.accountAddressText}>
                          {chainConfig.get(chainId)?.name}
                        </Typography>
                      </Box>
                    </MenuItem>
                  );
                })}
              </Select>
            </Box>
          </Box>
        </Box>
        <Box ml={2} mt={2} display="flex" alignItems="center">
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
  );
};
export default AccountChainBar;
