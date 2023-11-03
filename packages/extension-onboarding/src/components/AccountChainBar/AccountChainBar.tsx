import { Box, Grid, MenuItem, Select, Typography } from "@material-ui/core";
import {
  AccountAddress,
  chainConfig,
  ChainId,
  EChainType,
} from "@snickerdoodlelabs/objects";
import {
  AccountIdentIcon,
  SDTypography,
  getAccountAddressText,
} from "@snickerdoodlelabs/shared-components";
import clsx from "clsx";
import React, { FC, useEffect, useMemo } from "react";

import { useStyles } from "@extension-onboarding/components/AccountChainBar/AccountChainBar.style";
import { tokenInfoObj } from "@extension-onboarding/constants/tokenInfo";
import { useAppContext } from "@extension-onboarding/context/App";
import Switch from "@extension-onboarding/components/v2/Switch";

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
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex">
            <Box display="flex" alignItems="center" ml="auto">
              <SDTypography
                variant="titleMd"
                fontWeight="medium"
                color="textHeading"
                onClick={() => {
                  setDisplayMode(EDisplayMode.TESTNET);
                }}
                className={clsx(classes.switchNetwork, {
                  [classes.unfocused]: displayMode != EDisplayMode.TESTNET,
                })}
              >
                Testnet
              </SDTypography>
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
              <Box ml={1} />
              <SDTypography
                variant="titleMd"
                fontWeight="medium"
                color="textHeading"
                onClick={() => {
                  setDisplayMode(EDisplayMode.MAINNET);
                }}
                className={clsx(classes.switchNetwork, {
                  [classes.unfocused]: displayMode != EDisplayMode.MAINNET,
                })}
              >
                Mainnet
              </SDTypography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <SDTypography variant="bodyLg" fontWeight="medium">
            Accounts
          </SDTypography>

          <Box mt={0.5} display="flex" justifyContent="space-between">
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
                    key={account.sourceAccountAddress}
                    value={account.sourceAccountAddress}
                  >
                    <Box display="flex" alignItems="center">
                      <Box>
                        <AccountIdentIcon
                          accountAddress={account.sourceAccountAddress}
                        />
                      </Box>
                      <Typography className={classes.accountAddressText}>
                        {getAccountAddressText(account.sourceAccountAddress)}
                      </Typography>
                    </Box>
                  </MenuItem>
                );
              })}
            </Select>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <SDTypography variant="bodyLg" fontWeight="medium">
            Chain
          </SDTypography>

          <Box mt={0.5} display="flex" justifyContent="space-between">
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
        </Grid>
      </Grid>
    </Box>
  );
};
export default AccountChainBar;
