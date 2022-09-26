import { EModalSelectors } from "@extension-onboarding/components/Modals";
import RewardItem from "@extension-onboarding/components/RewardItem";
import { EWalletProviderKeys } from "@extension-onboarding/constants";
import { useAppContext } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { useStyles } from "@extension-onboarding/pages/Details/screens/Portfolio/Portfolio.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import React, { FC, useEffect, useState } from "react";
import coinbaseSmall from "@extension-onboarding/assets/icons/coinbaseSmall.svg";
import ethereumCircle from "@extension-onboarding/assets/icons/ethereum-circle.svg";
import metamaskLogo from "@extension-onboarding/assets/icons/metamaskSmall.svg";
import snickerDoodleLogo from "@extension-onboarding/assets/icons/snickerdoodleLogo.svg";
import avaxCircle from "@extension-onboarding/assets/images/avax-circle.png";
import polygonCircle from "@extension-onboarding/assets/images/polygon-circle.png";
import ethereumIcon from "@extension-onboarding/assets/icons/ethereum-icon.svg";
import avalancheIcon from "@extension-onboarding/assets/icons/avalanche-icon.svg";
import polygonIcon from "@extension-onboarding/assets/icons/polygon-icon.svg";
import {
  ChainId,
  EVMAccountAddress,
  IEVMBalance,
  IEVMNFT,
} from "@snickerdoodlelabs/objects";
import BalanceItem from "@extension-onboarding/components/BalanceItem";
import TokenItem from "@extension-onboarding/pages/Details/screens/Portfolio/components/TokenItem/TokenItem";
import NFTItem from "./components/NFTItem/NFTItem";

declare const window: IWindowWithSdlDataWallet;

export interface IAccountBalanceObject {
  [id: EVMAccountAddress]: IEVMBalance[];
}
export interface IChainBalanceObject {
  [id: ChainId]: IEVMBalance[];
}
export interface IAccountNFTsObject {
  [id: EVMAccountAddress]: IEVMNFT[];
}

const Portfolio: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { linkedAccounts } = useAppContext();
  const [accountBalances, setAccountBalances] =
    useState<IAccountBalanceObject>();
  const [chainIdBalance, setChainIdBalance] = useState<IChainBalanceObject>();

  const [accountNFTs, setAccountNFTs] = useState<IEVMNFT[]>([]);

  const [isBalancesLoading, setIsBalancesLoading] = useState(true);
  const [isNFTsLoading, setIsNFTsLoading] = useState(true);
  const [accountSelect, setAccountSelect] = useState<EVMAccountAddress>();
  const [chainSelect, setChainSelect] = useState(0);

  useEffect(() => {
    test();
    initializeBalances();
    initializeNfts();
  }, []);

  useEffect(() => {
    console.log("chainBalance", chainIdBalance);
    console.log("chainIDBALANCE", getTotalBalanceByChainId(ChainId(1)));
  }, [chainIdBalance]);

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
        console.log("NFTs",result)
        setAccountNFTs(result);
        /*  const structeredNFTs = result.reduce((acc, item) => {
          if (acc[item.owner]) {
            acc[item.owner] = [...acc[item.owner], item];
          } else {
            acc[item.owner] = [item];
          }
          return acc;
        }, {} as IAccountNFTsObject);
        setAccountNFTs(structeredNFTs); */
      });
  };

  const test = () => {
    window.sdlDataWallet
      .getAccountBalances()
      .mapErr((e) => {
        setIsBalancesLoading(false);
      })
      .map((result) => {
        const groupedByChanId = result.reduce((acc, currentValue) => {
          let groupKey = currentValue["chainId"];
          if (!acc[groupKey]) {
            acc[groupKey] = [];
          }
          acc[groupKey].push(currentValue);
          return acc;
        }, {} as IChainBalanceObject);
        setChainIdBalance(groupedByChanId);
      });
  };

  const getTotalBalanceByChainId = (id: ChainId) => {
    return chainIdBalance?.[id].reduce((accumulator, object) => {
      return accumulator + object.quoteBalance;
    }, 0);
  };

  const classes = useStyles();

  const handleAccountChange = (event: any) => {
    console.log("event", event.target.value);
    setAccountSelect(event.target.value);
  };
  const handleChainChange = (event: any) => {
    console.log("event", event.target.value);
    setChainSelect(event.target.value);
  };

  return (
    <Box>
      <Box mb={4}>
        <Typography className={classes.title}>My Portfolio</Typography>
        <Typography className={classes.description}>
          All of your assets in one place.
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Box
          width={250}
          height={100}
          borderRadius={8}
          bgcolor={"rgba(185, 182, 211, 0.2)"}
        >
          <Box p={2}>
            <Typography
              style={{
                color: "rgba(35, 32, 57, 0.8)",
                fontFamily: "Space Grotesk",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              Net Worth
            </Typography>
            <Typography
              style={{
                color: "#5D5A74",
                fontFamily: "Space Grotesk",
                fontSize: 34,
                fontWeight: 400,
              }}
            >
              $ 345
            </Typography>
          </Box>
        </Box>
        <Box
          width={250}
          height={100}
          borderRadius={8}
          bgcolor={"rgba(185, 182, 211, 0.2)"}
        >
          <Box p={2}>
            <Typography
              style={{
                color: "rgba(35, 32, 57, 0.8)",
                fontFamily: "Space Grotesk",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              Number of Tokens
            </Typography>
            <Typography
              style={{
                color: "#5D5A74",
                fontFamily: "Space Grotesk",
                fontSize: 34,
                fontWeight: 400,
              }}
            >
              5
            </Typography>
          </Box>
        </Box>
        <Box
          width={250}
          height={100}
          borderRadius={8}
          bgcolor={"rgba(253, 243, 225, 0.5)"}
        >
          <Box p={2}>
            <Typography
              style={{
                color: "rgba(35, 32, 57, 0.8)",
                fontFamily: "Space Grotesk",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              Number of Collections
            </Typography>
            <Typography
              style={{
                color: "#5D5A74",
                fontFamily: "Space Grotesk",
                fontSize: 34,
                fontWeight: 400,
              }}
            >
              4
            </Typography>
          </Box>
        </Box>
        <Box
          width={250}
          height={100}
          borderRadius={8}
          bgcolor={"rgba(253, 243, 225, 0.5)"}
        >
          <Box p={2}>
            <Typography
              style={{
                color: "rgba(35, 32, 57, 0.8)",
                fontFamily: "Space Grotesk",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              Number of NFTs
            </Typography>
            <Typography
              style={{
                color: "#5D5A74",
                fontFamily: "Space Grotesk",
                fontSize: 34,
                fontWeight: 400,
              }}
            >
              6
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box mt={5}>
        <Typography className={classes.subTitle}>Accounts</Typography>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Select
              className={classes.selectAccount}
              fullWidth
              variant="outlined"
              name="accounts"
              placeholder="Accounts"
              value={accountSelect}
              onChange={handleAccountChange}
            >
              {linkedAccounts?.map((account) => {
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
                        {account.accountAddress.slice(0, 5)} ................
                        {account.accountAddress.slice(-4)}
                      </Typography>
                    </Box>
                  </MenuItem>
                );
              })}
            </Select>
          </Box>
          <Box display="flex">
            <Button
              onClick={() => {
                setChainSelect(0);
              }}
            >
              <Typography
                style={{
                  paddingLeft: "8px",
                  textTransform: "none",
                  fontFamily: "Space Grotesk",
                  fontWeight: 500,
                  fontSize: 16,
                  color: "#232039",
                }}
              >
                All
              </Typography>
            </Button>
            <Button
              onClick={() => {
                setChainSelect(1);
              }}
            >
              <Box display="flex">
                <img src={ethereumIcon} />
                <Typography
                  style={{
                    paddingLeft: "8px",
                    textTransform: "none",
                    fontFamily: "Space Grotesk",
                    fontWeight: 500,
                    fontSize: 16,
                    color: "#232039",
                  }}
                >
                  Ethereum
                </Typography>
              </Box>
            </Button>
            <Button
              onClick={() => {
                setChainSelect(43113);
              }}
            >
              <Box display="flex">
                <img src={avalancheIcon} />
                <Typography
                  style={{
                    paddingLeft: "8px",
                    textTransform: "none",
                    fontFamily: "Space Grotesk",
                    fontWeight: 500,
                    fontSize: 16,
                    color: "#232039",
                  }}
                >
                  <Typography
                    style={{
                      paddingLeft: "8px",
                      textTransform: "none",
                      fontFamily: "Space Grotesk",
                      fontWeight: 500,
                      fontSize: 16,
                      color: "#232039",
                    }}
                  >
                    Avalanche
                  </Typography>
                </Typography>
              </Box>
            </Button>
            <Button
              onClick={() => {
                setChainSelect(137);
              }}
            >
              <Box display="flex">
                <img src={polygonIcon} />
                <Typography
                  style={{
                    paddingLeft: "8px",
                    textTransform: "none",
                    fontFamily: "Space Grotesk",
                    fontWeight: 500,
                    fontSize: 16,
                    color: "#232039",
                  }}
                >
                  Polygon
                </Typography>
              </Box>
            </Button>
          </Box>
        </Box>
      </Box>
      <Box
        width="100%"
        mt={3}
        style={{
          border: "1px solid rgba(207, 201, 200, 0.37)",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
        }}
      >
        <Grid container>
          <Grid xs={6}>
            <Typography
              style={{
                fontFamily: "Space Grotesk",
                fontWeight: 500,
                fontSize: 16,
                color: "#5D5A74",
              }}
            >
              My Tokens
            </Typography>
          </Grid>
          <Grid xs={6}>
            <Typography
              style={{
                fontFamily: "Space Grotesk",
                fontWeight: 500,
                fontSize: 16,
                color: "#5D5A74",
              }}
            >
              My NFTs
            </Typography>
          </Grid>
          <Grid xs={6} style={{ marginTop: "30px" }}>
            <Box>
              <Box my={3}>
                <TokenItem
                  image={ethereumCircle}
                  name="Ethereum"
                  balance={0.133}
                  currency={1664}
                  ticker="ETH"
                />
              </Box>
              <Box my={3}>
                <TokenItem
                  image={ethereumCircle}
                  name="Ethereum"
                  balance={0.133}
                  currency={1664}
                  ticker="ETH"
                />
              </Box>
            </Box>
          </Grid>
          <Grid xs={6}>
            <NFTItem nftList={accountNFTs} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
export default Portfolio;
