import { Box, Typography } from "@material-ui/core";
import { PageInvitation } from "@snickerdoodlelabs/objects";
import React, { FC } from "react";

interface IInvitationCardProps {
  pageInvitation: PageInvitation;
}
export const InvitationCard: FC<IInvitationCardProps> = ({
  pageInvitation,
}) => {
  return (
    <>
      <Box px={6}>
        <Typography variant="h1" color="textPrimary">
          {pageInvitation.domainDetails.title}
        </Typography>
      </Box>
      <Box
        width="-webkit-fill-available"
        display="flex"
        justifyContent="center"
        my={5.5}
      >
        <img
          style={{
            width: "40%",
            height: "auto",
            aspectRatio: 2 / 3,
            objectFit: "cover",
          }}
          src={pageInvitation.domainDetails.nftClaimedImage}
        />
      </Box>
      <Typography variant="h4" color="textPrimary">
        {pageInvitation.domainDetails.rewardName}
      </Typography>
    </>
  );
};
