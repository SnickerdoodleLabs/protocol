import {
  Box,
  CircularProgress,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import React, { FC, useEffect, useState } from "react";
import PrimaryButton from "@extension-onboarding/components/PrimaryButton";
import { useAppContext } from "@extension-onboarding/context/App";
import { useStyles } from "@extension-onboarding/pages/Onboarding/ViewAccountDetails/ViewAccountDetails.style";
import coinbaseSmall from "@extension-onboarding/assets/icons/coinbaseSmall.svg";
import ethereumCircle from "@extension-onboarding/assets/icons/ethereum-circle.svg";
import avaxCircle from "@extension-onboarding/assets/images/avax-circle.png";
import metamaskLogo from "@extension-onboarding/assets/icons/metamaskSmall.svg";
import {
  EVMAccountAddress,
  IEVMBalance,
  TickerSymbol,
} from "@snickerdoodlelabs/objects";
import { EWalletProviderKeys } from "@extension-onboarding/constants";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/sdlDataWallet/interfaces/IWindowWithSdlDataWallet";
import BalanceItem from "@extension-onboarding/components/BalanceItem/";

declare const window: IWindowWithSdlDataWallet;
export interface IAccountBalanceObject {
  [id: EVMAccountAddress]: IEVMBalance[];
}
export interface IAccountTickerObject {
  [id: TickerSymbol]: IEVMBalance[];
}
const ViewAccountDetails: FC = () => {
  // TODO
  const currencies = {
    ETH: 1666.66,
    AVAX: 24.22,
  };

  const { linkedAccounts, viewDetailsAccountAddress } = useAppContext();
  const [accountBalances, setAccountBalances] =
    useState<IAccountBalanceObject>();
  const [accountNFTs, setAccountNFTs] = useState<any>();

  const [isLoading, setIsLoading] = useState(true);
  const [accountSelect, setAccountSelect] = useState<EVMAccountAddress>(
    viewDetailsAccountAddress ?? linkedAccounts[0].accountAddress,
  );
  const [chainSelect, setChainSelect] = useState("ETH");

  useEffect(() => {
    initiliaze();
  }, []);

  useEffect(() => {
    if (accountBalances) {
      setIsLoading(false);
    }
  }, [accountBalances]);

  const initiliaze = async () => {
    await window.sdlDataWallet
      .getAccountBalances()
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
      })
      .andThen(() => {
        return window.sdlDataWallet.getAccountNFTs().map((result) => {
          setAccountNFTs(result);
        });
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
    <Box>
      <Box>
        <h3 className={classes.buildYourProfileText}>Account Details</h3>
      </Box>
      <Box display="flex">
        <Box display="flex" alignItems="center" style={{ width: "50px" }}>
          <Box>
            <Typography
              style={{
                fontFamily: "Space Grotesk",
                color: "#232039",
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              Accounts
            </Typography>
            <Select
              className={classes.selectAccount}
              fullWidth
              variant="outlined"
              name="accounts"
              placeholder="Accounts"
              value={accountSelect}
              onChange={handleAccountChange}
            >
              {linkedAccounts.map((account, index) => {
                return (
                  <MenuItem value={account.accountAddress}>
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

          <Box ml={3}>
            <Typography
              style={{
                fontFamily: "Space Grotesk",
                color: "#232039",
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              Chains
            </Typography>
            <Select
              className={classes.selectChain}
              variant="outlined"
              fullWidth
              name="chains"
              placeholder="chains"
              value={chainSelect}
              onChange={handleChainChange}
            >
              <MenuItem value="ETH">
                <Box display="flex">
                  <Box>
                    <img width={40} height={40} src={ethereumCircle} />
                  </Box>
                  <Typography className={classes.accountAddressText}>
                    Ethereum
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
          style={{ background: "#F1F0F6", border: "1px solid  #ECECEC" }}
        >
          <Box m={2}>
            <Typography
              style={{
                fontFamily: "Space Grotesk",
                color: "#5D5A74",
                fontSize: 16,
                fontWeight: 700,
                lineHeight: "20px",
                letterSpacing: "0.25px",
              }}
            >
              Net Worth
            </Typography>
            <Typography
              style={{
                fontFamily: "Space Grotesk",
                color: "#5D5A74",
                fontSize: 34,
                fontWeight: 400,
                lineHeight: "36px",
                letterSpacing: "0.25px",
                paddingTop: 8,
              }}
            >
              ${" "}
              {accountBalances?.[accountSelect].reduce((acc, balanceItem) => {
                acc =
                  acc +
                  parseInt(balanceItem.balance) *
                    currencies[balanceItem.ticker];
                return acc;
              }, 0)}
            </Typography>
          </Box>
        </Box>
        <Box
          width={270}
          height={100}
          borderRadius={8}
          ml={3}
          style={{ background: "#F1F0F6", border: "1px solid  #ECECEC" }}
        >
          <Box m={2}>
            <Typography
              style={{
                fontFamily: "Space Grotesk",
                color: "#5D5A74",
                fontSize: 16,
                fontWeight: 700,
                lineHeight: "20px",
                letterSpacing: "0.25px",
              }}
            >
              Number of Tokens
            </Typography>
            <Typography
              style={{
                fontFamily: "Space Grotesk",
                color: "#5D5A74",
                fontSize: 34,
                fontWeight: 400,
                lineHeight: "36px",
                letterSpacing: "0.25px",
                paddingTop: 8,
              }}
            >
              {accountBalances?.[accountSelect].length}
            </Typography>
          </Box>
        </Box>
        <Box
          width={270}
          height={100}
          borderRadius={8}
          ml={3}
          style={{
            background: "rgba(253, 243, 225, 0.5)",
            border: "1px solid  #ECECEC",
          }}
        >
          <Box m={2}>
            <Typography
              style={{
                fontFamily: "Space Grotesk",
                color: "#5D5A74",
                fontSize: 16,
                fontWeight: 700,
                lineHeight: "20px",
                letterSpacing: "0.25px",
              }}
            >
              Number of Collections
            </Typography>
            <Typography
              style={{
                fontFamily: "Space Grotesk",
                color: "#5D5A74",
                fontSize: 34,
                fontWeight: 400,
                lineHeight: "36px",
                letterSpacing: "0.25px",
                paddingTop: 8,
              }}
            >
              0
            </Typography>
          </Box>
        </Box>
        <Box
          width={270}
          height={100}
          borderRadius={8}
          ml={3}
          style={{
            background: "rgba(253, 243, 225, 0.5)",
            border: "1px solid  #ECECEC",
          }}
        >
          <Box m={2}>
            <Typography
              style={{
                fontFamily: "Space Grotesk",
                color: "#5D5A74",
                fontSize: 16,
                fontWeight: 700,
                lineHeight: "20px",
                letterSpacing: "0.25px",
              }}
            >
              Number of NFTs
            </Typography>
            <Typography
              style={{
                fontFamily: "Space Grotesk",
                color: "#5D5A74",
                fontSize: 34,
                fontWeight: 400,
                lineHeight: "36px",
                letterSpacing: "0.25px",
                paddingTop: 8,
              }}
            >
              0
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box display="flex">
        <Box
          width={580}
          height={536}
          borderRadius={8}
          style={{ border: "1px solid #ECECEC" }}
        >
          <Box m={3}>
            <Typography
              style={{
                fontFamily: "Space Grotesk",
                color: "#232039",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              Your Tokens
            </Typography>
            {isLoading ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                mt={10}
              >
                <CircularProgress />
              </Box>
            ) : (
              accountBalances?.[accountSelect].map((balanceItem, index) => {
                return (
                  <BalanceItem
                    key={index}
                    item={balanceItem}
                    currency={currencies[balanceItem.ticker]}
                  />
                );
              })
            )}
          </Box>
        </Box>

        <Box
          width={580}
          height={536}
          borderRadius={8}
          ml={5}
          style={{ border: "1px solid #ECECEC" }}
        >
          <Box m={3}>
            <Typography
              style={{
                fontFamily: "Space Grotesk",
                color: "#232039",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              Your NFTs
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box className={classes.buttonContainer}>
        <PrimaryButton
          type="submit"
          onClick={() => {
            window.sdlDataWallet.closeTab();
          }}
        >
          Close
        </PrimaryButton>
      </Box>
    </Box>
  );
};

export default ViewAccountDetails;
