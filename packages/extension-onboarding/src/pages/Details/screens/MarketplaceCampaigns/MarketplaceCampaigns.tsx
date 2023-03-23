import emptyCampaign from "@extension-onboarding/assets/images/empty-campaign.svg";
import { EModalSelectors } from "@extension-onboarding/components/Modals";
import { DefaultCampaignItem } from "@extension-onboarding/components/CampaignItems";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { useStyles } from "@extension-onboarding/pages/Details/screens/MarketplaceCampaigns/MarketplaceCampaigns.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { Box, CircularProgress, Grid, Typography } from "@material-ui/core";
import {
  EVMContractAddress,
  EWalletDataType,
  IpfsCID,
} from "@snickerdoodlelabs/objects";
import React, { FC, useEffect, useState } from "react";

declare const window: IWindowWithSdlDataWallet;

const MarketPlaceCampaigns: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [
    campaignContractAddressesWithCID,
    setCampaignContractAddressesWithCID,
  ] = useState<Record<EVMContractAddress, IpfsCID>>();
  const { setModal, closeModal, setLoadingStatus } = useLayoutContext();
  useEffect(() => {
    getInvitations();
  }, []);

  useEffect(() => {
    if (campaignContractAddressesWithCID) {
      if (isLoading) {
        setIsLoading(false);
      }
    }
  }, [JSON.stringify(campaignContractAddressesWithCID)]);

  const getInvitations = () => {
    return window.sdlDataWallet
      .getAvailableInvitationsCID()
      .mapErr((e) => {
        setIsLoading(false);
      })
      .map((metaData) => {
        setCampaignContractAddressesWithCID(metaData);
      });
  };

  const acceptInvitation = (
    dataTypes: EWalletDataType[] | null,
    consentContractAddress: EVMContractAddress,
  ) => {
    setLoadingStatus(true);
    return window.sdlDataWallet
      .acceptInvitation(dataTypes, consentContractAddress)
      .mapErr((e) => {
        setLoadingStatus(false);
      })
      .map(() => {
        const metadata = { ...campaignContractAddressesWithCID };
        delete metadata[consentContractAddress];
        setCampaignContractAddressesWithCID(metadata);
        setLoadingStatus(false);
      });
  };

  const onClaimClick = (consentContractAddress: EVMContractAddress) => {
    return window.sdlDataWallet
      .getApplyDefaultPermissionsOption()
      .map((option) => {
        if (option) {
          acceptInvitation(null, consentContractAddress);
          return;
        }
        setModal({
          modalSelector: EModalSelectors.PERMISSION_SELECTION,
          onPrimaryButtonClick: () => {
            acceptInvitation(null, consentContractAddress);
            closeModal();
          },
          customProps: {
            onManageClicked: () => {
              setModal({
                modalSelector: EModalSelectors.MANAGE_PERMISSIONS,
                onPrimaryButtonClick: (dataTpes: EWalletDataType[]) => {
                  acceptInvitation(dataTpes, consentContractAddress);
                },
              });
            },
          },
        });
      });
  };

  const onReviewClick = (consentContractAddress: EVMContractAddress) => {};

  const classes = useStyles();

  return null;

  // return (
  //   <Box>
  //     <Box mb={5}>
  //       <Typography className={classes.title}>
  //         Browse Available Rewards
  //       </Typography>
  //     </Box>
  //     <Box mb={2}>
  //       <Typography className={classes.subTitle}>Featured Rewards</Typography>
  //       <Box mt={2} mb={5}>
  //         <img
  //           style={{ width: "100%" }}
  //           src="https://i.ibb.co/TBfCbXB/Group-626053.png"
  //         />
  //       </Box>
  //     </Box>
  //     <Box mb={2}>
  //       <Typography className={classes.subTitle}>
  //         Browse Available Rewards
  //       </Typography>
  //     </Box>
  //     <Box mb={2}>
  //       <Typography className={classes.description}>
  //         Your NFTs, from linked accounts and newly earned rewards.
  //       </Typography>
  //     </Box>
  //     {isLoading ? (
  //       <Box display="flex" alignItems="center" justifyContent="center" mt={15}>
  //         <CircularProgress />
  //       </Box>
  //     ) : (
  //       <Grid container spacing={2}>
  //         {campaignContractAddressesWithCID &&
  //         Object.keys(campaignContractAddressesWithCID).length ? (
  //           Object.keys(campaignContractAddressesWithCID)?.map((key, index) => (
  //             <CampaignItem
  //               button={
  //                 <Box display="flex">
  //                   {/*   <Box>
  //                     <Typography
  //                       onClick={() => {
  //                         onReviewClick(key as EVMContractAddress);
  //                       }}
  //                       className={classes.link}
  //                     >
  //                       {}
  //                       Review
  //                     </Typography>
  //                   </Box> */}
  //                   <Box>
  //                     <Typography
  //                       onClick={() => {
  //                         onClaimClick(key as EVMContractAddress);
  //                       }}
  //                       className={classes.link}
  //                     >
  //                       {}
  //                       Claim
  //                     </Typography>
  //                   </Box>
  //                 </Box>
  //               }
  //               key={key}
  //               campaignCID={campaignContractAddressesWithCID[key]}
  //             />
  //           ))
  //         ) : (
  //           <Box width="100%" display="flex">
  //             <Box
  //               justifyContent="center"
  //               alignItems="center"
  //               width="100%"
  //               display="flex"
  //               pt={20}
  //             >
  //               <img
  //                 style={{ width: 330, height: "auto" }}
  //                 src={emptyCampaign}
  //               />
  //             </Box>
  //           </Box>
  //         )}
  //       </Grid>
  //     )}
  //   </Box>
  // );
};
export default MarketPlaceCampaigns;
