import { useStyles } from "@extension-onboarding/components/AccountChainBar/AccountChainBar.style";
import { useAppContext } from "@extension-onboarding/context/App";
import { Box, Grid, MenuItem, Select } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  AccountAddress,
  chainConfig,
  ChainId,
  EChainType,
} from "@snickerdoodlelabs/objects";
import {
  AccountIdentIcon,
  SDTypography,
  SDSwitch,
  colors,
  abbreviateString,
  tokenInfoObj,
} from "@snickerdoodlelabs/shared-components";
import clsx from "clsx";
import React, { FC, useEffect, useMemo } from "react";

export enum EDisplayMode {
  MAINNET,
  TESTNET,
}

export const { mainnetSupportedChainIds, testnetSupportedChainIds } =
  Array.from(chainConfig.values()).reduce(
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
  accountAdressesToRender?: AccountAddress[];
  chainIdsToRender?: ChainId[];
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
  accountAdressesToRender,
  chainIdsToRender,
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

  const _chainIdsToRender = useMemo(() => {
    if (EDisplayMode.MAINNET === displayMode) {
      if (chainIdsToRender && chainIdsToRender?.length > 0) {
        return chainIdsToRender?.filter((chainId) =>
          mainnetSupportedChainIds.includes(chainId),
        );
      }

      return mainnetSupportedChainIds;
    }
    if (chainIdsToRender && chainIdsToRender?.length > 0) {
      return chainIdsToRender?.filter((chainId) =>
        testnetSupportedChainIds.includes(chainId),
      );
    }
    return testnetSupportedChainIds;
  }, [displayMode, chainIdsToRender]);

  const accountsToRender = useMemo(() => {
    if (accountAdressesToRender) {
      return accountAdressesToRender;
    }
    return linkedAccounts?.map((account) => account.sourceAccountAddress);
  }, [linkedAccounts, accountAdressesToRender]);

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
              <SDSwitch
                bgColor={colors.MAINPURPLE900}
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
              className={classes.select}
              fullWidth
              IconComponent={ExpandMoreIcon}
              variant="outlined"
              name="accounts"
              value={accountSelect ?? "all"}
              inputProps={{
                classes: {
                  icon: classes.selectIcon,
                },
              }}
              placeholder="All"
              onChange={handleAccountChange}
            >
              <MenuItem
                classes={{
                  root: classes.menuItem,
                  selected: classes.menuSelected,
                }}
                value="all"
              >
                All
              </MenuItem>
              {accountsToRender?.map((account) => {
                return (
                  <MenuItem
                    classes={{
                      root: classes.menuItem,
                      selected: classes.menuSelected,
                    }}
                    key={account}
                    value={account}
                  >
                    <Box display="flex" alignItems="center">
                      <AccountIdentIcon size={32} accountAddress={account} />
                      <Box ml={1} />
                      <SDTypography
                        variant="bodyLg"
                        fontWeight="medium"
                        color="textHeading"
                      >
                        {abbreviateString(account, 8, 3, 6)}
                      </SDTypography>
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
              className={classes.select}
              fullWidth
              IconComponent={ExpandMoreIcon}
              variant="outlined"
              name="chains"
              inputProps={{
                classes: {
                  icon: classes.selectIcon,
                },
              }}
              value={chainSelect ?? "all"}
              placeholder="All"
              onChange={handleChainChange}
            >
              <MenuItem
                classes={{
                  root: classes.menuItem,
                  selected: classes.menuSelected,
                }}
                value="all"
              >
                All
              </MenuItem>
              {_chainIdsToRender.map((chainId) => {
                const iconSrc =
                  tokenInfoObj[
                    chainConfig.get(chainId)?.nativeCurrency?.symbol ?? ""
                  ]?.iconSrc;
                return (
                  <MenuItem
                    classes={{
                      root: classes.menuItem,
                      selected: classes.menuSelected,
                    }}
                    key={chainId}
                    value={chainId}
                  >
                    <Box display="flex" alignItems="center">
                      <img src={iconSrc} style={{ width: 24, height: 24 }} />
                      <Box ml={1} />
                      <SDTypography
                        variant="bodyLg"
                        fontWeight="medium"
                        color="textHeading"
                      >
                        {chainConfig.get(chainId)?.name}
                      </SDTypography>
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
