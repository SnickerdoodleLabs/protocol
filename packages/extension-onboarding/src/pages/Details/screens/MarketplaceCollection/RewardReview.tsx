import { useStyles } from "@extension-onboarding/pages/Details/screens/MarketplaceCollection/MarketplaceCollection.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import React, { FC, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ChainId,
  DirectReward,
  EVMAccountAddress,
  EVMContractAddress,
  EWalletDataType,
  IpfsCID,
  TransactionReceipt,
} from "@snickerdoodlelabs/objects";
import RewardComponent from "./RewardComponent";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { EModalSelectors } from "@extension-onboarding/components/Modals";
import { useAppContext } from "@extension-onboarding/context/App";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";

declare const window: IWindowWithSdlDataWallet;

const RewardReview: FC = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [ipfsRewards, setIpfsRewards] = useState<any>({});
  const { rewardItem } = (useLocation().state || {}) as {
    rewardItem: any;
  };

  useEffect(() => {
    if (!rewardItem) {
      navigate(EPaths.MARKETPLACE_COLLECTION, { replace: true });
    } else {
      setIpfsRewards(rewardItem);
    }
  }, []);

  const ipfsParse = (ipfs: string) => {
    let a;
    if (ipfs) {
      a = ipfs.replace("ipfs://", "");
    }
    return `https://cloudflare-ipfs.com/ipfs/${a}`;
  };

  return (
    <>
      {ipfsRewards && (
        <Box>
          <Box display="flex" alignItems="center" mb={4}>
            <Typography
              style={{
                fontFamily: "Space Grotesk",
                fontWeight: 400,
                fontSize: 14,
                color: "#202223",
              }}
            >
              SDL
            </Typography>
            <ArrowForwardIosIcon style={{ fontSize: 12, margin: "0 15px" }} />
            <Typography
              style={{
                fontFamily: "Space Grotesk",
                fontWeight: 500,
                fontSize: 14,
                color: "#202223",
              }}
            >
              {ipfsRewards?.name}
            </Typography>
          </Box>

          <Grid container>
            <Grid item xs={5}>
              <Box
                width={430}
                py={3}
                px={1}
                mb={2}
                borderRadius={8}
                border="1px solid rgba(128, 121, 180, 0.48)"
              >
                <img width="100%" src={ipfsParse(ipfsRewards?.image)} />
              </Box>
              <Typography
                style={{
                  fontFamily: "Space Grotesk",
                  fontWeight: 700,
                  fontSize: 20,
                  lineHeight: "26px",
                  color: "#232039",
                }}
              >
                Description
              </Typography>
              <Box mt={1} pr={1}>
                <Typography
                  style={{
                    fontFamily: "Space Grotesk",
                    fontWeight: 400,
                    fontSize: 16,
                    lineHeight: "22px",
                    textAlign: "justify",
                    color: "#2D2944",
                  }}
                >
                  {ipfsRewards?.description}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={7}>
              <Box ml={3}>
                <Box mb={3}>
                  <Typography
                    style={{
                      fontFamily: "Space Grotesk",
                      fontWeight: 400,
                      fontSize: 16,
                      lineHeight: "24px",
                      textTransform: "capitalize",
                      textDecorationLine: "underline",
                      color: "#232039",
                    }}
                  >
                    SDL
                  </Typography>
                </Box>

                <Box mb={1}>
                  <Typography
                    style={{
                      fontFamily: "Space Grotesk",
                      fontWeight: 700,
                      fontSize: 36,
                      lineHeight: "24px",
                      color: "#232039",
                    }}
                  >
                    {ipfsRewards?.name}
                  </Typography>
                </Box>

                <Box mb={2}>
                  <Typography
                    style={{
                      fontFamily: "Space Grotesk",
                      fontWeight: 400,
                      fontSize: 14,
                      lineHeight: "24px",
                      textTransform: "capitalize",
                      color: "#232039",
                    }}
                  >
                    Created By SDL
                  </Typography>
                </Box>

                <Box width="100%" bgcolor="#F5F5F5" p={3} mb={5}>
                  <Box mb={1.5}>
                    <Typography
                      style={{
                        fontFamily: "Space Grotesk",
                        fontWeight: 700,
                        fontSize: 20,
                        lineHeight: "26px",
                        textTransform: "capitalize",
                        color: "#232039",
                      }}
                    >
                      To Claim This Reward
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      style={{
                        fontFamily: "Space Grotesk",
                        fontWeight: 400,
                        fontSize: 16,
                        lineHeight: "22px",
                        color: "#2D2944",
                      }}
                    >
                      You are renting your:
                    </Typography>
                  </Box>
                  <Box my={1.5}>
                    <ul>
                      {ipfsRewards?.attributes
                        ?.filter(
                          (d) => d?.trait_type === "requiredPermissions",
                        )[0]
                        .value.map((data) => {
                          return (
                            <li>
                              <Typography
                                style={{
                                  fontFamily: "Space Grotesk",
                                  fontWeight: 400,
                                  fontSize: 16,
                                  lineHeight: "32px",
                                  color: "#151320",
                                  textAlign: "justify",
                                }}
                              >
                                {EWalletDataType[data]}
                              </Typography>
                            </li>
                          );
                        })}
                    </ul>
                  </Box>
                  <Box display="flex" flexDirection="row-reverse">
                    <Box>
                      <Typography
                        style={{
                          fontFamily: "Space Grotesk",
                          fontWeight: 400,
                          fontSize: 14,
                          lineHeight: "22px",
                          color: "#5D4F97",
                        }}
                      >
                        <b>5466</b> People Claimed
                      </Typography>
                      <Button
                        style={{
                          padding: "12px 24px",
                          background: "#5A5292",
                          fontFamily: "Space Grotesk",
                          fontSize: 16,
                          borderRadius: 8,
                          color: "#F2F4F7",
                          fontWeight: "700",
                          textTransform: "none",
                        }}
                      >
                        Claim Reward
                      </Button>
                    </Box>
                  </Box>
                </Box>
                <Box>
                  <Typography
                    style={{
                      fontFamily: "Space Grotesk",
                      fontWeight: 400,
                      fontSize: 20,
                      lineHeight: "24px",
                      color: "#232039",
                    }}
                  >
                    Properties
                  </Typography>
                </Box>
                <Box mt={2} display="flex">
                  <Box>
                    <Box
                      width={180}
                      border="1px solid #E0E0E0"
                      borderRadius={12}
                      p={1.5}
                    >
                      <Typography
                        style={{
                          fontFamily: "Space Grotesk",
                          fontWeight: 700,
                          fontSize: 14,
                          lineHeight: "18px",
                          color: "#424242",
                        }}
                      >
                        Year
                      </Typography>

                      <Typography
                        style={{
                          fontFamily: "Space Grotesk",
                          fontWeight: 700,
                          fontSize: 14,
                          lineHeight: "18px",
                          color: "#424242",
                        }}
                      >
                        2022
                      </Typography>
                    </Box>
                  </Box>

                  <Box ml={1}>
                    <Box
                      width={180}
                      border="1px solid #E0E0E0"
                      borderRadius={12}
                      p={1.5}
                    >
                      <Typography
                        style={{
                          fontFamily: "Space Grotesk",
                          fontWeight: 700,
                          fontSize: 14,
                          lineHeight: "18px",
                          color: "#424242",
                        }}
                      >
                        Object
                      </Typography>

                      <Typography
                        style={{
                          fontFamily: "Space Grotesk",
                          fontWeight: 700,
                          fontSize: 14,
                          lineHeight: "18px",
                          color: "#424242",
                        }}
                      >
                        Beanie
                      </Typography>
                    </Box>
                  </Box>

                  <Box ml={1}>
                    <Box
                      width={180}
                      border="1px solid #E0E0E0"
                      borderRadius={12}
                      p={1.5}
                    >
                      <Typography
                        style={{
                          fontFamily: "Space Grotesk",
                          fontWeight: 700,
                          fontSize: 14,
                          lineHeight: "18px",
                          color: "#424242",
                        }}
                      >
                        Object
                      </Typography>

                      <Typography
                        style={{
                          fontFamily: "Space Grotesk",
                          fontWeight: 700,
                          fontSize: 14,
                          lineHeight: "18px",
                          color: "#424242",
                        }}
                      >
                        Beanie
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};
export default RewardReview;
