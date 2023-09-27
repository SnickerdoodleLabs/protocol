import { Box, Typography } from "@core-iframe/app/ui/lib";
import { IOpenSeaMetadata } from "@snickerdoodlelabs/objects";
import React, { FC } from "react";

interface IInvitationCardProps {
  invitationData: IOpenSeaMetadata;
}
export const InvitationCard: FC<IInvitationCardProps> = ({
  invitationData,
}) => {
  return (
    <>
      <Box px={6}>
        <Typography variant="title">{invitationData.title}</Typography>
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
          src={invitationData.nftClaimedImage}
        />
      </Box>
      <Typography variant="bodyBold">{invitationData.rewardName}</Typography>
    </>
  );
};
