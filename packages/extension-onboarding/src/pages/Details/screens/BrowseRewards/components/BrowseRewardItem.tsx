import { Box, Grid, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import {
  EVMContractAddress,
  Invitation,
  IpfsCID,
} from "@snickerdoodlelabs/objects";
import React, { FC, useEffect, useState } from "react";
import { useStyles } from "@extension-onboarding/pages/Details/screens/BrowseRewards/BrowseRewards.style";
import BrokenImageIcon from "@material-ui/icons/BrokenImage";
import { useNavigate } from "react-router-dom";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { isValidURL } from "@extension-onboarding/utils";
import { useAppContext } from "@extension-onboarding/context/App";
interface IBrowseRewardItemProps {
  cid: IpfsCID;
}
declare const window: IWindowWithSdlDataWallet;

const BrowseRewardItem: FC<IBrowseRewardItemProps> = ({ cid }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rewardItem, setRewardItem] = useState<any>({});
  const navigate = useNavigate();
  const classes = useStyles();

  const { setInvitationInfo } = useAppContext();

  useEffect(() => {
    fetch(`https://cloudflare-ipfs.com/ipfs/${cid}`).then((res) => {
      res.json().then((data) => {
        setRewardItem(data);
      });
    });
  }, []);

  const onClaimClick = (url: string) => {
    if (!url) {
      return null;
    }
    const isURL = isValidURL(url);
    if (isURL) {
      return window.open(url, "_blank");
    } else {
      return setInvitationInfo({
        consentAddress: url as EVMContractAddress,
        signature: undefined,
        tokenId: undefined,
        rewardImage: undefined,
      });
    }
  };

  const ipfsParse = (ipfs: string) => {
    let a;
    if (ipfs) {
      a = ipfs.replace("ipfs://", "");
    }
    return `https://cloudflare-ipfs.com/ipfs/${a}`;
  };
  return (
    <>
      <Grid item xs={12} sm={3}>
        <Box
          width="100%"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          border="1px solid #D9D9D9"
          borderRadius={8}
        >
          <Box mx="auto" p={2} width="calc(100% - 32px)">
            {rewardItem ? (
              <img
                className={classes.image}
                src={ipfsParse(rewardItem?.image)}
              />
            ) : isLoading ? (
              <Box className={classes.imageLoader}>
                <Skeleton variant="rect" width="100%" height="100%" />
              </Box>
            ) : (
              <Box className={classes.imageLoader}>
                <BrokenImageIcon className={classes.brokenImageIcon} />
              </Box>
            )}
            <Box mt={1.5}>
              <Typography
                style={{
                  fontFamily: "Space Grotesk",
                  fontWeight: 700,
                  fontSize: 16,
                  lineHeight: "20px",
                  color: "rgba(35, 32, 57, 0.87)",
                }}
              >
                {rewardItem?.rewardName}
              </Typography>
            </Box>
            <Typography
              style={{
                fontFamily: "Space Grotesk",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "24px",
                color: "#9E9E9E",
              }}
            >
              Limited collection
            </Typography>
            <Box display="flex" mt={1}>
              <Box display="flex">
                <Box>
                  <Typography
                    onClick={() => {
                      navigate(EPaths.MARKETPLACE_REWARD, {
                        state: {
                          rewardItem,
                        },
                      });
                    }}
                    className={classes.link}
                  >
                    {}
                    Review
                  </Typography>
                </Box>
                <Box ml={3}>
                  <Typography
                    onClick={() => {
                      onClaimClick(rewardItem?.external_url);
                    }}
                    className={classes.link}
                  >
                    {}
                    Claim
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>
    </>
  );
};
export default BrowseRewardItem;
