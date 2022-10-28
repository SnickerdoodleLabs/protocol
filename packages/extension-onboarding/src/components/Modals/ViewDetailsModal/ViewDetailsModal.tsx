import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import {
  EVMAccountAddress,
  TokenBalance,
  WalletNFT,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import React, { FC, useEffect, useState } from "react";

import coinbaseSmall from "@extension-onboarding/assets/icons/coinbaseSmall.svg";
import ethereumCircle from "@extension-onboarding/assets/icons/ethereum-circle.svg";
import metamaskLogo from "@extension-onboarding/assets/icons/metamaskSmall.svg";
import snickerDoodleLogo from "@extension-onboarding/assets/icons/snickerdoodleLogo.svg";
import avaxCircle from "@extension-onboarding/assets/images/avax-circle.png";
import polygonCircle from "@extension-onboarding/assets/images/polygon-circle.png";
import BalanceItem from "@extension-onboarding/components/BalanceItem/";
import { useStyles } from "@extension-onboarding/components/Modals/ViewDetailsModal/ViewDetailsModal.style";
import NFTItem from "@extension-onboarding/components/NFTItem";
import PrimaryButton from "@extension-onboarding/components/PrimaryButton";
import { EWalletProviderKeys } from "@extension-onboarding/constants";
import { useAppContext } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";

declare const window: IWindowWithSdlDataWallet;
export interface IAccountBalanceObject {
  [id: EVMAccountAddress]: TokenBalance[];
}
export interface IAccountNFTsObject {
  [id: EVMAccountAddress]: WalletNFT[];
}

const ViewDetailsModal: FC = () => {
  const { closeModal, modalState } = useLayoutContext();

  const { account } = modalState.customProps;
  // TODO
  const currencies = {
    ETH: 1666.66,
    AVAX: 24.22,
  };

  const { linkedAccounts } = useAppContext();
  const [accountBalances, setAccountBalances] =
    useState<IAccountBalanceObject>();
  const [accountNFTs, setAccountNFTs] = useState<IAccountNFTsObject>();

  const [isBalancesLoading, setIsBalancesLoading] = useState(true);
  const [isNFTsLoading, setIsNFTsLoading] = useState(true);
  const [accountSelect, setAccountSelect] = useState<EVMAccountAddress>(
    account?.accountAddress,
  );
  const [chainSelect, setChainSelect] = useState("1");

  useEffect(() => {
    initializeBalances();
    initializeNfts();
  }, []);

  useEffect(() => {
    if (accountBalances) {
      setIsBalancesLoading(false);
    }
  }, [JSON.stringify(accountBalances)]);

  useEffect(() => {
    if (accountNFTs) {
      setIsNFTsLoading(false);
    }
  }, [JSON.stringify(accountNFTs)]);

  const initializeBalances = async () => {
    window.sdlDataWallet
      .getAccountBalances()
      .mapErr((e) => {
        setIsBalancesLoading(false);
      })
      .map((result) => {
        const structeredBalances = result.reduce((acc, item) => {
          if (acc[item.accountAddress]) {
            acc[item.accountAddress] = [...acc[item.accountAddress], item];
          } else {
            acc[item.accountAddress] = [item];
          }
          return acc;
        }, {} as IAccountBalanceObject);
        setAccountBalances(structeredBalances);
      });
  };

  const initializeNfts = () => {
    window.sdlDataWallet
      .getAccountNFTs()
      .mapErr((e) => {
        setIsNFTsLoading(false);
      })
      .map((result) => {
        const structeredNFTs = result.reduce((acc, item) => {
          if (acc[item.owner]) {
            acc[item.owner] = [...acc[item.owner], item];
          } else {
            acc[item.owner] = [item];
          }
          return acc;
        }, {} as IAccountNFTsObject);
        setAccountNFTs(structeredNFTs);
      });
  };

  const handleAccountChange = (event: any) => {
    console.log("event", event.target.value);
    setAccountSelect(event.target.value);
  };
  const handleChainChange = (event: any) => {
    console.log("event", event.target.value);
    setChainSelect(event.target.value);
  };

  const classes = useStyles();

  return (
    <>
      <Modal
        open
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          display="flex"
          justifyContent="center"
          style={{
            overflowY: "scroll",
            width: "100%",
            height: "100%",
            position: "absolute",
            background: "white",
          }}
        >
          <Box>
            <Box pt={8}>
              <img src={snickerDoodleLogo} />
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={1}
            >
              <h3 className={classes.title}>Account Details</h3>
              <IconButton onClick={closeModal}>
                <CloseIcon fontSize="large" />
              </IconButton>
            </Box>
            <Box display="flex">
              <Box display="flex" alignItems="center" width={50}>
                <Box>
                  <Typography className={classes.subTitle}>Accounts</Typography>
                  <Select
                    className={classes.selectAccount}
                    fullWidth
                    variant="outlined"
                    name="accounts"
                    placeholder="Accounts"
                    value={accountSelect}
                    onChange={handleAccountChange}
                  >
                    {linkedAccounts?.map((account, index) => {
                      return (
                        <MenuItem
                          key={account.accountAddress}
                          value={account.accountAddress}
                        >
                          <Box display="flex">
                            <Box>
                              {account.providerKey ===
                              EWalletProviderKeys.METAMASK ? (
                                <img src={metamaskLogo} />
                              ) : (
                                <img src={coinbaseSmall} />
                              )}
                            </Box>
                            <Typography className={classes.accountAddressText}>
                              {account.accountAddress.slice(0, 5)}{" "}
                              ................
                              {account.accountAddress.slice(-4)}
                            </Typography>
                          </Box>
                        </MenuItem>
                      );
                    })}
                  </Select>
                </Box>

                <Box ml={3}>
                  <Typography className={classes.subTitle}>Chains</Typography>
                  <Select
                    className={classes.selectChain}
                    variant="outlined"
                    fullWidth
                    name="chains"
                    placeholder="chains"
                    value={chainSelect}
                    onChange={handleChainChange}
                  >
                    <MenuItem value="1">
                      <Box display="flex">
                        <Box>
                          <img width={35} height={35} src={ethereumCircle} />
                        </Box>
                        <Typography className={classes.accountAddressText}>
                          Ethereum Mainnet
                        </Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="42">
                      <Box display="flex">
                        <Box>
                          <img width={35} height={35} src={ethereumCircle} />
                        </Box>
                        <Typography className={classes.accountAddressText}>
                          Ethereum Kovan
                        </Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="43113">
                      <Box display="flex">
                        <Box>
                          <img width={35} height={35} src={avaxCircle} />
                        </Box>
                        <Typography className={classes.accountAddressText}>
                          Avalanche Fuji
                        </Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="43114">
                      <Box display="flex">
                        <Box>
                          <img width={35} height={35} src={avaxCircle} />
                        </Box>
                        <Typography className={classes.accountAddressText}>
                          Avalanche Mainnet
                        </Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="137">
                      <Box display="flex">
                        <Box>
                          <img width={35} height={35} src={polygonCircle} />
                        </Box>
                        <Typography className={classes.accountAddressText}>
                          Polygon Mainnet
                        </Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="80001">
                      <Box display="flex">
                        <Box>
                          <img width={35} height={35} src={polygonCircle} />
                        </Box>
                        <Typography className={classes.accountAddressText}>
                          Polygon Mumbai
                        </Typography>
                      </Box>
                    </MenuItem>
                  </Select>
                </Box>
              </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" mt={4} mb={2}>
              <Box
                width={270}
                height={100}
                borderRadius={8}
                className={classes.cardBackground2}
              >
                <Box m={2}>
                  <Typography className={classes.cardTitle}>
                    Net Worth
                  </Typography>
                  <Typography className={classes.cardDescription}>
                    ${" "}
                    {accountBalances?.[accountSelect]
                      .reduce((acc, balanceItem) => {
                        acc =
                          acc +
                          parseFloat(
                            ethers.utils.formatUnits(balanceItem.balance),
                          ) *
                            (currencies[balanceItem.ticker] ?? 1);
                        return acc;
                      }, 0)
                      .toFixed(2)}
                  </Typography>
                </Box>
              </Box>
              <Box
                width={270}
                height={100}
                borderRadius={8}
                ml={3}
                className={classes.cardBackground2}
              >
                <Box m={2}>
                  <Typography className={classes.cardTokenText}>
                    Number of Tokens
                  </Typography>
                  <Typography className={classes.cardDescription}>
                    {accountBalances?.[accountSelect]?.length ?? 0}
                  </Typography>
                </Box>
              </Box>
              <Box
                width={270}
                height={100}
                borderRadius={8}
                ml={3}
                className={classes.cardBackground}
              >
                <Box m={2}>
                  <Typography className={classes.cardTokenText}>
                    Number of Collections
                  </Typography>
                  <Typography className={classes.cardDescription}>0</Typography>
                </Box>
              </Box>
              <Box
                width={270}
                height={100}
                borderRadius={8}
                ml={3}
                className={classes.cardBackground}
              >
                <Box m={2}>
                  <Typography className={classes.cardTokenText}>
                    Number of NFTs
                  </Typography>
                  <Typography className={classes.cardDescription}>
                    {" "}
                    {accountNFTs?.[accountSelect]?.length ?? 0}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box display="flex">
              <Box
                width={580}
                height={536}
                borderRadius={8}
                border="1px solid #ECECEC"
              >
                <Box m={3}>
                  <Typography className={classes.tokenText}>
                    Your Tokens
                  </Typography>
                  {isBalancesLoading ? (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      mt={10}
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
                    accountBalances?.[accountSelect].map(
                      (balanceItem, index) => {
                        if (balanceItem.chainId.toString() === chainSelect) {
                          return (
                            <BalanceItem
                              key={index}
                              item={balanceItem}
                              currency={currencies[balanceItem.ticker] ?? 1}
                            />
                          );
                        } else {
                          return null;
                        }
                      },
                    )
                  )}
                </Box>
              </Box>
              <Box
                width={580}
                minHeight={536}
                height="100%"
                borderRadius={8}
                ml={5}
                border="1px solid #ECECEC"
              >
                <Box m={3}>
                  <Typography className={classes.tokenText}>
                    Your NFTs
                  </Typography>
                  {isNFTsLoading ? (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      mt={10}
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Grid container className={classes.nftContainer}>
                      {accountNFTs?.[accountSelect]?.map((nftItem, index) => {
                        if (nftItem.chain.toString() === chainSelect) {
                          return <NFTItem key={index} item={nftItem} />;
                        } else {
                          return null;
                        }
                      })}
                    </Grid>
                  )}
                </Box>
              </Box>
            </Box>
            <Box className={classes.buttonContainer}>
              <PrimaryButton onClick={closeModal}>Close</PrimaryButton>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ViewDetailsModal;
